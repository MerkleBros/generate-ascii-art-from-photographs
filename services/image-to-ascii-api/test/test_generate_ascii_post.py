import sys
import base64
sys.path.append("../")
from generate_ascii_post import generate_ascii_post

def main():

    msg = ""
    with open("test.jpg", "rb") as image_file:
        msg = base64.b64encode(image_file.read())
    print("base64 image: ", msg)
    body = {"input_file": msg}
    body["HORIZONTAL_SAMPLING_RATE"] = 0.1
    body["GCF"] = 1
    body["output_file"] = "test_output.png"
    body["color1"] = "black"
    body["color2"] = "black"
    body["bgcolor"] = "white"

    event = {"body": body}
    context = {}

    print(generate_ascii_post(event, context))

if __name__ == '__main__':
    main()
