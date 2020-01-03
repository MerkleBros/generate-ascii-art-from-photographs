import React, { useState } from "react";

export default function ImageForm(props) {
  const [images, setImages] = useState({urls: [], files: []});

  const handleChange = e => {
    const files = Array.from(e.target.files)
    const urls = files.map(file => URL.createObjectURL(file))
    setImages({
      urls: urls,
      files: files
    });
    console.log("In handleChange, image: ", images)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("in handleSubmit")

    const formData = new FormData()
    formData.append('content', images.files[0])

    let reader = new FileReader();
    reader.readAsDataURL(images.files[0]);
    reader.addEventListener("load", async function () {
      // convert image file to base64 string

      console.log("reader.result: ", reader.result)
      console.log("formData: ", formData)
      console.log('images.files[0]: ', images.files[0])
      console.log('images.urls[0]: ', images.urls[0])
      try {
        const response = await fetch(
          "https://cors-anywhere.herokuapp.com/https://r76qcc9zjc.execute-api.us-east-1.amazonaws.com/dev/generate_ascii"
          , { method: 'POST'
            , mode: 'cors' // no-cors, *cors, same-origin
            , isBase64Encoded: true
            , headers: 
              { 'Content-Type': 'application/x-www-form-urlencoded'
              , 'Accept':       'image/png;base64'
              }
            , body: reader.result // body data type must match "Content-Type" header
            }); 

        console.log(response)
      } catch(e) {
        console.log('error in fetch: ', e)
      }
    }, false);
  };

  return (
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
  );
}
