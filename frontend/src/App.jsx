import React, { useState } from 'react';
import axios from 'axios';
import './ImageUpload.css'; // Import the CSS file for styling

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [className, setClassName] = useState('');
  const [confidence, setConfidence] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setError('');
    } else {
      setError('Please drop a valid image file.');
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setError('');
    } else {
      setError('Please select a valid image file.');
    }
  };

  // Handle form submission (image upload)
  const handleUpload = async () => {
    if (!selectedImage) {
      setError('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setClassName(response.data.class);
      setConfidence(response.data.confidence);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Error uploading image, please try again later.');
    }
  };

  return (
    <div className="main-container">
      <h1 className="title">Brain Tumor Classification</h1>
      <div
        className={`image-upload-container ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDragLeave={handleDragEnd}
        onDrop={handleDrop}
      >
        <h2>Drag & Drop Image or Click to Select</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input" className="upload-label">
          Choose Image
        </label>

        {selectedImage && (
          <div className="image-info">
            <p>Selected Image: {selectedImage.name}</p>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="preview-image"
            />
          </div>
        )}

        <div>
          <button onClick={handleUpload} className="upload-btn">
            Upload Image
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {className && (
          <div className="result">
            <h3>Prediction:</h3>
            <p>Class: {className}</p>
            <p>Confidence: {confidence}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
