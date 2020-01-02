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

  const handleSubmit = e => {
    e.preventDefault();
    console.log("in handleSubmit")
    // Details for the api
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
