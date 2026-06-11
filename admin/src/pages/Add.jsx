import React, { useState } from "react";
import apiService from '../services/apiService';
import '../CSS/Add.css';

const Add = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    firmness: 'Medium',
    sizes: [],
    point1: '',
    point2: '',
    point3: '',
    specifications: [],
    discount: 0,
    rating: 4.5,
    subCategory: 'General',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      let newSizes;
      if (checked) {
        newSizes = [...prev.sizes, value];
      } else {
        newSizes = prev.sizes.filter(size => size !== value);
      }

      const primarySize = newSizes.length > 0 ? newSizes[0] : 'Queen';

      return {
        ...prev,
        sizes: newSizes,
        size: primarySize
      };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: files
    }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleSpecificationChange = (index, field, value) => {
    setFormData(prev => {
      const newSpecs = [...prev.specifications];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, specifications: newSpecs };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setMessage('Please login as admin first');
        setLoading(false);
        return;
      }

      if (!formData.name || !formData.description || !formData.price) {
        setMessage('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (formData.sizes.length === 0) {
        setMessage('Please select at least one size');
        setLoading(false);
        return;
      }

      if (!formData.point1 || !formData.point2 || !formData.point3) {
        setMessage('Please fill in all three feature points');
        setLoading(false);
        return;
      }

      const productData = {
        ...formData,
        sizes: JSON.stringify(formData.sizes),
        specifications: JSON.stringify(formData.specifications.filter(spec => spec.key && spec.value)),
        bestseller: false,
        subCategory: formData.subCategory || 'General'
      };

      console.log('Sending product data:', productData);
      console.log('subCategory value:', productData.subCategory);
      const response = await apiService.addProduct(productData);
      console.log('Response from server:', response);

      if (response.success) {
        setMessage('Product added successfully!');
        setFormData({
          name: '',
          description: '',
          price: '',
          firmness: 'Medium',
          sizes: [],
          point1: '',
          point2: '',
          point3: '',
          specifications: [],
          discount: 0,
          rating: 4.5,
          subCategory: 'General',
          images: []
        });
        const fileInput = document.getElementById('images-addadmin');
        if (fileInput) fileInput.value = '';
      } else {
        setMessage('Failed to add product: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container-addadmin">
      <div className="page-header-addadmin">
        <div className="header-content-addadmin">
          <h1 className="page-title-addadmin">Add New Product</h1>
          <p className="page-subtitle-addadmin">Fill in the product details to add it to your inventory</p>
        </div>
      </div>

      <div className="page-content-addadmin">
        {message && (
          <div className={`message-addadmin ${message.includes('successfully') ? 'success-addadmin' : 'error-addadmin'}`}>
            <div className="message-icon-addadmin">
              {message.includes('successfully') ? '✓' : '⚠'}
            </div>
            <span>{message}</span>
          </div>
        )}

        <form className="add-form-addadmin" onSubmit={handleSubmit}>
          <div className="form-section-addadmin">
            <h3 className="section-title-addadmin">Basic Information</h3>

            <div className="form-group-addadmin">
              <label className="form-label-addadmin">Product Name *</label>
              <input
                type="text"
                name="name"
                className="form-input-addadmin"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group-addadmin">
              <label className="form-label-addadmin">Product Description *</label>
              <textarea
                name="description"
                className="form-textarea-addadmin"
                placeholder="Enter detailed product description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="form-row-addadmin">
              <div className="form-group-addadmin">
                <label className="form-label-addadmin">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  className="form-input-addadmin"
                  placeholder="999"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group-addadmin">
                <label className="form-label-addadmin">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  className="form-input-addadmin"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row-addadmin">
              <div className="form-group-addadmin">
                <label className="form-label-addadmin">Firmness *</label>
                <select
                  name="firmness"
                  className="form-select-addadmin"
                  value={formData.firmness}
                  onChange={handleChange}
                  required
                >
                  <option value="Soft">Soft</option>
                  <option value="Medium">Medium</option>
                  <option value="Firm">Firm</option>
                </select>
              </div>

              <div className="form-group-addadmin">
                <label className="form-label-addadmin">Rating</label>
                <input
                  type="number"
                  name="rating"
                  className="form-input-addadmin"
                  placeholder="4.5"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section-addadmin">
            <h3 className="section-title-addadmin">Product Features</h3>

            <div className="form-group-addadmin">
              <label className="form-label-addadmin">Available Sizes *</label>
              <div className="sizes-grid-addadmin">
                {['Single', 'Double', 'Queen', 'King'].map(size => (
                  <label key={size} className="size-card-addadmin">
                    <input
                      type="checkbox"
                      name="sizes"
                      value={size}
                      checked={formData.sizes.includes(size)}
                      onChange={handleSizeCheckboxChange}
                      className="size-checkbox-addadmin"
                    />
                    <span className="size-label-addadmin">{size}</span>
                    <span className="checkmark-addadmin">✓</span>
                  </label>
                ))}
              </div>
              {formData.sizes.length > 0 && (
                <div className="sizes-preview-addadmin">
                  <span className="preview-label-addadmin">Selected:</span>
                  <span className="preview-values-addadmin">{formData.sizes.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="form-group-addadmin">
              <label className="form-label-addadmin">Key Feature 1 *</label>
              <input
                type="text"
                name="point1"
                className="form-input-addadmin"
                placeholder="e.g., Premium Quality Materials"
                value={formData.point1}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group-addadmin">
              <label className="form-label-addadmin">Key Feature 2 *</label>
              <input
                type="text"
                name="point2"
                className="form-input-addadmin"
                placeholder="e.g., Superior Comfort"
                value={formData.point2}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group-addadmin">
              <label className="form-label-addadmin">Key Feature 3 *</label>
              <input
                type="text"
                name="point3"
                className="form-input-addadmin"
                placeholder="e.g., Long-lasting Durability"
                value={formData.point3}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section-addadmin">
            <h3 className="section-title-addadmin">Product Specifications</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              Add product specifications (e.g., Material, Dimensions, Weight, etc.)
            </p>

            {formData.specifications.map((spec, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', marginBottom: '1rem', alignItems: 'end' }}>
                <div className="form-group-addadmin">
                  <label className="form-label-addadmin">Specification Key</label>
                  <input
                    type="text"
                    className="form-input-addadmin"
                    placeholder="e.g., Material, Dimensions, Weight"
                    value={spec.key}
                    onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                  />
                  {index === 0 && (
                    <small style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                      Example: Material, Dimensions, Weight, Warranty
                    </small>
                  )}
                </div>
                <div className="form-group-addadmin">
                  <label className="form-label-addadmin">Specification Value</label>
                  <input
                    type="text"
                    className="form-input-addadmin"
                    placeholder="e.g., Memory Foam, 72x60 inches, 25 kg"
                    value={spec.value}
                    onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                  />
                  {index === 0 && (
                    <small style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                      Example: Memory Foam, 72x60 inches, 25 kg, 10 years
                    </small>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    height: 'fit-content'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addSpecification}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#22327a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>+</span>
              Add Specification
            </button>

            {formData.specifications.length === 0 && (
              <div style={{
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: '8px',
                marginTop: '1rem',
                border: '1px dashed #ddd'
              }}>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                  <strong>Example Specifications:</strong><br />
                  Material: Memory Foam<br />
                  Dimensions: 72x60 inches<br />
                  Weight: 25 kg<br />
                  Warranty: 10 years<br />
                  Thickness: 8 inches
                </p>
              </div>
            )}
          </div>

          <div className="form-section-addadmin">
            <h3 className="section-title-addadmin">Product Images</h3>

            <div className="form-group-addadmin">
              <label className="form-label-addadmin">Upload Images (up to 4) *</label>
              <div className="file-upload-wrapper-addadmin">
                <input
                  type="file"
                  id="images-addadmin"
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                  className="file-input-addadmin"
                />
                <label htmlFor="images-addadmin" className="file-label-addadmin">
                  <span className="upload-icon-addadmin">📁</span>
                  <span className="upload-text-addadmin">
                    {formData.images.length > 0
                      ? `${formData.images.length} file(s) selected`
                      : 'Choose Images'
                    }
                  </span>
                </label>
              </div>
              {formData.images.length > 0 && (
                <div className="selected-files-addadmin">
                  {formData.images.map((file, index) => (
                    <div key={index} className="file-chip-addadmin">
                      <span className="file-name-addadmin">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions-addadmin">
            <button
              type="submit"
              className="submit-btn-addadmin"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-addadmin"></span>
                  Adding Product...
                </>
              ) : (
                <>
                  <span>✓</span>
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Add;