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
      const result = reader.result.substring(reader.result.indexOf(",") + 1)
      console.log("result: ", result)
      console.log("formData: ", formData)
      console.log('images.files[0]: ', images.files[0])
      console.log('images.urls[0]: ', images.urls[0])
      try {
        const response = await fetch(
          "https://cors-anywhere.herokuapp.com/https://ovr5yyzvza.execute-api.us-east-1.amazonaws.com/dev/generate_ascii"
          , { method: 'POST'
            , mode: 'cors' // no-cors, *cors, same-origin
            , headers: 
              { 'Content-Type': 'image/jpg'
              , 'Accept': 'image/png'
              }
            , body: images.files[0] // body data type must match "Content-Type" header
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
