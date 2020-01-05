import React, { useState } from "react";
import Gallery from 'react-grid-gallery';
import uuidv1 from 'uuid/v1';

export default function ImageForm(props) {
  const [images, setImages] = useState([]);

  const handleChange =
    event => {
      const thumbnailHeight = props.thumbnailHeight
      const files = Array.from(event.target.files)

      const imageObjects = 
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

    setImages(imageObjects)
  };

  const postFileToAPI = 
    async (file) => {
      console.log("Posting file to Serverless API");
      return await fetch(
        "https://cors-anywhere.herokuapp.com/" +
        "https://ovr5yyzvza.execute-api.us-east-1.amazonaws.com/dev/generate_ascii", 
        { method: 'POST'
        , mode: 'cors'
        , headers: 
          { 'Content-Type': 'image/jpg'
          , 'Accept': 'image/png'
          }
        , body: file
    }); 
  };

  const createImageObjectFromResponse =
    async (response) => {
      console.log("Proccessing response from Serverless API");

      const blob = await response.blob()
      const file = new File([blob], uuidv1())
      const url = URL.createObjectURL(file)
      const image = new Image()
      image.src = url

      console.log("response blob: ", blob)
      console.log("file: ", file)
      console.log("url: ", url)

      return { file: file
             , src: image.src
             , thumbnail: image.src
             , thumbnailHeight: props.thumbnailHeight
             , thumbnailWidth: (image.width / image.height) * props.thumbnailHeight
  }}

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      try {
        for (const image of images) {
          const response = await postFileToAPI(image.file)
          const imageObject = await createImageObjectFromResponse(response)

          console.log("response object: ", response)
          console.log("ImageObject inside handleSubmit: ", imageObject)

          setImages([...images, imageObject])
        }
      } catch(e) {
        const message = "Error processing file in API: "
        console.log(message, e)
      }
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
            onChange={e => handleChange(e)} />
        </label>
        <input 
          type="submit" 
          value="Submit"/>
      </form>
      <Gallery 
        images={images} 
        backdropClosesModal={true} />
    </>
  );
}
