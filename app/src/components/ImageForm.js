import React, { useState } from "react";
import Gallery from 'react-grid-gallery';
import uuidv1 from 'uuid/v1';

export default function ImageForm(props) {
  const [images, setImages] = useState([]);

  const handleBrowseFiles =
    async(event) => {
      const thumbnailHeight = props.thumbnailHeight
      const files = Array.from(event.target.files)

      const loadedImages = 
        await Promise.all(files.map(file => loadImage(file)))

      const imageObjects = 
        loadedImages.map(
          image => createImageObject(image.file, image.image, "ready"))

      setImages(imageObjects)
  };

  const createImageObject = (file, image, state) => {
    return { file: file
           , image: image
           , tags: [{value: state, title: "state"}]
           , src: image.src
           , thumbnail: image.src
           , thumbnailHeight: props.thumbnailHeight
           , thumbnailWidth: (image.width / image.height) * props.thumbnailHeight
    }};

  const loadImage = (file) => {
    return new Promise((resolve, reject) => {
      try {
        const image = new Image();
        image.id = uuidv1();
        image.src = URL.createObjectURL(file);
        image.onload = () => {
          resolve({image: image, file: file});
        }
      } catch(e) {
        // TODO: Resolve with placeholder image
      }
  })};

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
      console.log("Response: ", response)

      const blob = await response.blob()
      const file = new File([blob], uuidv1())
      const {image} = await loadImage(file)

      console.log("response blob: ", blob)
      console.log("file: ", file)

      return createImageObject(file, image, "ascii")
    };

  const updateImage = image => {
    setImages(oldImages => {
      const index = images.indexOf(image)
      const newImages = [...oldImages]
      newImages[index] = image;
      return newImages;
    })
  };

  const handleSubmit =
    async (event) => {
      try {
        event.preventDefault();

        for (const image of images) {
          try {

            image.tags[0].value = "processing"
            updateImage(image)

            const response = await postFileToAPI(image.file)
            console.log("response object: ", response)

            if (response.status !== 200) {
              image.tags[0].value = "failed"
              updateImage(image)
              continue;
            }

            const imageObject = await createImageObjectFromResponse(response)

            image.tags[0].value = "finished"
            image["isSelected"] = true


            setImages(oldImages => [...oldImages, imageObject])

          } catch(e) {
            const message = "Error processing file with API: "
            console.log(message, e)
            continue;
          }
        }
      } catch(e) {
        const message = "Error processing files with API: "
        console.log(message, e)
      }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Upload file
          <input 
            id='image-input'
            type='file' 
            multiple
            accept='.png, .jpg, .jpeg'
            onChange={e => handleBrowseFiles(e)} />
        </label>
        <input 
          type="submit" 
          value="Submit"/>
      </form>
      <Gallery 
        images={images} 
        backdropClosesModal={true} />
    </div>
  );
}
