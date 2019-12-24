# Copyright (c) 2017, Shanshan Wang, MIT license
# Copyright (c) 2019, Patrick McCarver, MIT license
import os
import re
import random
from glob import glob
import progressbar
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from colour import Color

VAPOR_WAVE_COLORS = {
    "pinkpunk": '#FF6AD5',
    "mauve": '#C774E8',
    "lightpurple": '#AD8CFF',
    "bluesuede": '#8795E8',
    "babyblue": '#94D0FF',
    "black": "black"
}

# f: Input filename
# HORIZONTAL_SAMPLING_RATE: the horizontal pixel sampling rate. Between 0(exclusive) and 1(inclusive).
# The larger the number, the more details in the output.
# If you want the ascii art output be the same size as input, use ~ 1/ font size width.
# GCF: brightness and contrast tuning factor. GCF>1 is brighter; 0<GCF<1, darker.
# output_file: output filename
# color1, color2, bgcolor: follow W3C color naming https://www.w3.org/TR/css3-color/#svg-color

def asciiart(input_file, HORIZONTAL_SAMPLING_RATE, GCF, output_file, color1='black', color2='blue', bgcolor='white'):

    # The array of ascii symbols from white to black
    chars = np.asarray(list(' .,:irs?@9B&#'))

    # Load the fonts and then get the the height and width of a typical symbol
    # You can use different fonts here
    font = ImageFont.load_default()
    letter_width = font.getsize("x")[0]
    letter_height = font.getsize("x")[1]

    height_width_ratio = letter_height/letter_width

    #open the input file
    img = Image.open(input_file)

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
    new_image.save(output_file)

def pick_vapor_wave_colors(number):
    return random.choices(list(VAPOR_WAVE_COLORS.keys()), k=number)

# main()
def main():

    HORIZONTAL_SAMPLING_RATE = 0.1    # pixel sampling rate in width
    GCF = 0.5    # contrast adjustment
    COLOR_ONE, COLOR_TWO = pick_vapor_wave_colors(2)

    files = []
    files.extend(glob('../images/*.png'))
    files.extend(glob('../images/*.jpg'))

    new_directory = (f"../results/{COLOR_ONE}-{COLOR_TWO}-contrast-"
                     f"{GCF}-sampling-{HORIZONTAL_SAMPLING_RATE}-0")

    while os.path.exists(new_directory):
        increment = re.search(r'\d+$', new_directory).group()
        new_increment = int(increment) + 1
        new_directory = new_directory[:-(len(increment) + 1)]
        new_directory = new_directory + f"-{new_increment}"

    os.mkdir(new_directory)

    progress_bar = progressbar.ProgressBar(max_value=len(files))
    print(f'Creating files in {new_directory}\n')

    for index, file_name in enumerate(files):
        basename = os.path.basename(file_name)
        asciiart(file_name, HORIZONTAL_SAMPLING_RATE, GCF,
                 f"{new_directory}/{basename}.png",
                 VAPOR_WAVE_COLORS[COLOR_ONE],
                 VAPOR_WAVE_COLORS[COLOR_TWO])
        progress_bar.update(index)

if __name__ == '__main__':
    main()
