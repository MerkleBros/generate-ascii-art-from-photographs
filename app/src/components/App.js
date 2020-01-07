import React from 'react';
import ImageForm from './ImageForm';

const App = () => {
  return (
    <>
      <div className="form-title">Turn your images into ASCII</div>
      <ImageForm 
        thumbnailHeight={300}
      />
    </>
  )
}
export default App;
