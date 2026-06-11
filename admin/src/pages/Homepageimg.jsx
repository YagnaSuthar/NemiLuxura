import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import '../CSS/Homepageimg.css';

const Homepageimg = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingImageId, setUploadingImageId] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await apiService.getHomepageImages();
      if (data.success) {
        setHeroImages(data.heroImages || []);
        setFeaturedImage(data.featuredImage);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHeroImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setMessage('');
      const order = heroImages.length;
      const data = await apiService.addHomepageImage(file, 'hero', order);
      if (data.success) {
        setMessage('Hero image added successfully!');
        fetchImages();
        e.target.value = ''; // Reset file input
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeaturedImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setMessage('');
      const data = await apiService.addHomepageImage(file, 'featured');
      if (data.success) {
        setMessage('Featured image added successfully!');
        fetchImages();
        e.target.value = ''; // Reset file input
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateImage = async (imageId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImageId(imageId);
      setMessage('');
      const data = await apiService.updateHomepageImage(imageId, file);
      if (data.success) {
        setMessage('Image updated successfully!');
        fetchImages();
        e.target.value = ''; // Reset file input
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setUploadingImageId(null);
    }
  };

  const handleDeleteImage = async (imageId, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type} image?`)) {
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      const data = await apiService.deleteHomepageImage(imageId);
      if (data.success) {
        setMessage(`${type} image deleted successfully!`);
        fetchImages();
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container-homepageimg">
      <div className="page-header-homepageimg">
        <div className="header-content-homepageimg">
          <h1 className="page-title-homepageimg">Homepage Images</h1>
          <p className="page-subtitle-homepageimg">Manage hero slider images and featured image for the homepage</p>
        </div>
      </div>

      <div className="page-content-homepageimg">
        {message && (
          <div className={`message-homepageimg ${message.includes('successfully') ? 'success-homepageimg' : 'error-homepageimg'}`}>
            <div className="message-icon-homepageimg">
              {message.includes('successfully') ? '✓' : '⚠'}
            </div>
            <span>{message}</span>
            <button className="message-close-homepageimg" onClick={() => setMessage('')}>×</button>
          </div>
        )}

        {/* Hero Images Section */}
        <div className="section-homepageimg">
          <div className="section-header-homepageimg">
            <h2 className="section-title-homepageimg">Hero Images (Slider)</h2>
            <div className="upload-section-homepageimg">
              <label htmlFor="add-hero-image" className="upload-btn-homepageimg">
                <span>+</span>
                Add Hero Image
              </label>
              <input
                type="file"
                id="add-hero-image"
                accept="image/*"
                onChange={handleAddHeroImage}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="images-grid-homepageimg">
            {heroImages.length === 0 ? (
              <div className="empty-state-homepageimg">
                <p>No hero images added yet. Click "Add Hero Image" to get started.</p>
              </div>
            ) : (
              heroImages.map((image, index) => (
                <div key={image._id} className="image-card-homepageimg">
                  <div className="image-wrapper-homepageimg">
                    <img src={image.imageUrl} alt={`Hero ${index + 1}`} />
                    <div className="image-overlay-homepageimg">
                      <label className="change-image-btn-homepageimg">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUpdateImage(image._id, e)}
                          disabled={uploadingImageId === image._id}
                          style={{ display: 'none' }}
                        />
                        {uploadingImageId === image._id ? 'Uploading...' : 'Change Image'}
                      </label>
                      <button
                        className="delete-image-btn-homepageimg"
                        onClick={() => handleDeleteImage(image._id, 'Hero')}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="image-label-homepageimg">Hero Image {index + 1}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Featured Image Section */}
        <div className="section-homepageimg">
          <div className="section-header-homepageimg">
            <h2 className="section-title-homepageimg">Featured Image</h2>
            {!featuredImage && (
              <div className="upload-section-homepageimg">
                <label htmlFor="add-featured-image" className="upload-btn-homepageimg">
                  <span>+</span>
                  Add Featured Image
                </label>
                <input
                  type="file"
                  id="add-featured-image"
                  accept="image/*"
                  onChange={handleAddFeaturedImage}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>

          <div className="featured-image-container-homepageimg">
            {featuredImage ? (
              <div className="image-card-homepageimg featured-card-homepageimg">
                <div className="image-wrapper-homepageimg">
                  <img src={featuredImage.imageUrl} alt="Featured" />
                  <div className="image-overlay-homepageimg">
                    <label className="change-image-btn-homepageimg">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUpdateImage(featuredImage._id, e)}
                        disabled={uploadingImageId === featuredImage._id}
                        style={{ display: 'none' }}
                      />
                      {uploadingImageId === featuredImage._id ? 'Uploading...' : 'Change Image'}
                    </label>
                    <button
                      className="delete-image-btn-homepageimg"
                      onClick={() => handleDeleteImage(featuredImage._id, 'Featured')}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="image-label-homepageimg">Featured Image</p>
              </div>
            ) : (
              <div className="empty-state-homepageimg">
                <p>No featured image added yet. Click "Add Featured Image" to add one.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepageimg;

