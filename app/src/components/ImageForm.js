import React, { useState } from "react";
import { render } from 'react-dom';
import Gallery from 'react-grid-gallery';

export default function ImageForm(props) {
  const [images, setImages] = useState([]);

  const handleChange = e => {
    const thumbnailHeight = props.thumbnailHeight
    const files = Array.from(e.target.files)

    const previewImages = 
      files
        .map(file => {
          const image = new Image();
          image.src = URL.createObjectURL(file);
          return { file: file
                 , src: image.src
                 , thumbnail: image.src
                 , thumbnailHeight: thumbnailHeight
                 , thumbnailWidth: (image.width / image.height) * thumbnailHeight
    }});

    setImages(previewImages)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("in handleSubmit")

    let reader = new FileReader();
    reader.readAsDataURL(images[0].file);
    reader.addEventListener("load", async function () {
      // convert image file to base64 string

      console.log("reader.result: ", reader.result)
      const result = reader.result.substring(reader.result.indexOf(",") + 1)
      console.log("result: ", result)
      console.log('images[0].file: ', images[0].file)
      console.log('images[0].src: ', images[0].src)
      try {
        const response = await fetch(
          "https://cors-anywhere.herokuapp.com/https://ovr5yyzvza.execute-api.us-east-1.amazonaws.com/dev/generate_ascii"
          , { method: 'POST'
            , mode: 'cors' // no-cors, *cors, same-origin
            , headers: 
              { 'Content-Type': 'image/jpg'
              , 'Accept': 'image/png'
              }
            , body: images[0].file // body data type must match "Content-Type" header
            }); 

        console.log("response:")
        console.log(response)
        const blob = await response.blob()
        console.log("response blob: ", blob)
        const file = new File([blob], "Response.png")
        console.log("file: ", file)
        const url = URL.createObjectURL(file)
        console.log("url: ", url)

        const img = new Image()
        img.src = url
        document.body.append(img)

        const link = document.createElement("a") 
        link.download = "response.png"
        link.href = url;
        link.text = "Download here"
        document.body.append(link)
        
      } catch(e) {
        console.log('error in fetch: ', e)
      }
    }, false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Upload images:
          <input 
            type='file' 
            multiple
            accept='.png, .jpg, .jpeg'
            id='image-input'
            onChange={e => handleChange(e)}
          />
        </label>
        <input type="submit" value="Submit"/>
      </form>
      <Gallery images={images} />
    </>
  );
}
