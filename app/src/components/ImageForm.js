import React, { useState } from "react";

export default function ImageForm(props) {
  const [images, setImages] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("in handleSubmit")
    // Details for the api
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Upload images:
        <input 
          type='file' 
          id='image-input'
          onChange={e => setImages(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit"/>
    </form>
  );

}
