import base64
import io
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from colour import Color

def generate_ascii_post(event, context):

    try:
        response = {
            "statusCode": 500,
            "isBase64Encoded": True,
            "headers": {'Content-Type': 'application/json'},
            "body": ""
        }
        # body = json.loads(event["body"])
        # input_file = body["input_file"]
        # HORIZONTAL_SAMPLING_RATE = body["HORIZONTAL_SAMPLING_RATE"]
        # GCF = body["GCF"]
        # output_file = body["output_file"]
        # color1 = body["color1"]
        # color2 = body["color2"]
        # bgcolor = body["bgcolor"]


        # TODO: Remove, hard coded to see if function works
        input_file = event["body"]
        HORIZONTAL_SAMPLING_RATE = 0.1
        GCF = 1
        color1 = "black"
        color2 =  "black"
        bgcolor = "white"

        # The array of ascii symbols from white to black
        chars = np.asarray(list(' .,:irs?@9B&#'))

        # Load the fonts and then get the the height and width of a typical symbol
        # You can use different fonts here
        font = ImageFont.load_default()
        letter_width = font.getsize("x")[0]
        letter_height = font.getsize("x")[1]

        height_width_ratio = letter_height/letter_width

        #open the input file
        message = base64.b64decode(input_file)
        buffer = io.BytesIO(message)
        img = Image.open(buffer)

        #Calculate how many ascii letters are needed on the width and height
        width_by_letter = round(img.size[0]*HORIZONTAL_SAMPLING_RATE*height_width_ratio)
        height_by_letter = round(img.size[1]*HORIZONTAL_SAMPLING_RATE)
        letter_size = (width_by_letter, height_by_letter)

        #Resize the image based on the symbol width and height
        img = img.resize(letter_size)

        #Get the RGB color values of each sampled pixel and convert them to graycolor using average.
        #https://www.johndcook.com/blog/2009/08/24/algorithms-convert-color-grayscale/
        img = np.sum(np.asarray(img), axis=2)

        # Normalize the results, enhance and reduce the brightness contrast.
        # Map grayscale values to bins of symbols
        img -= img.min()
        img = (1.0 - img/img.max())**GCF*(chars.size-1)

        # Generate the ascii art symbols
        lines = ("\n".join(("".join(r) for r in chars[img.astype(int)]))).split("\n")

        # Create gradient color bins
        nbins = len(lines)
        color_range = list(Color(color1).range_to(Color(color2), nbins))

        #Create an image object, set its width and height
        new_image_width = letter_width *width_by_letter
        new_image_height = letter_height * height_by_letter
        new_image = Image.new("RGBA", (new_image_width, new_image_height), bgcolor)
        draw = ImageDraw.Draw(new_image)

        # Print symbols to image
        left_padding = 0
        y = 0
        line_index = 0
        for line in lines:
            color = color_range[line_index]
            line_index += 1

            draw.text((left_padding, y), line, color.hex, font=font)
            y += letter_height

        # Save the image file
        buffered = io.BytesIO()
        new_image.save(buffered, format="PNG")
        image_string = base64.b64encode(buffered.getvalue()).decode('ascii')

        response = {
            "statusCode": 200,
            "isBase64Encoded": True,
            "headers": {'Content-Type': 'image/png'},
            "body": image_string
        }

        return response

    except Exception as err:
        response["body"] = "Error {}".format(err)
        return response
