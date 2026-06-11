import React, { useState, useEffect } from "react";
import apiService from '../services/apiService';
import '../CSS/List.css';

const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Edit states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    discount: 0,
    firmness: 'Medium',
    rating: 4.5,
    sizes: [],
    point1: '',
    point2: '',
    point3: '',
    specifications: [],
    subCategory: 'General',
    bestseller: false,
    images: [],
    imageUrls: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts();
      if (response.success) {
        setProducts(response.products);
      } else {
        setMessage('Failed to fetch products: ' + response.message);
      }
    } catch (error) {
      setMessage('Error fetching products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditProduct({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount || 0,
      firmness: product.firmness || 'Medium',
      rating: product.rating || 4.5,
      sizes: product.sizes || [],
      point1: product.point1 || '',
      point2: product.point2 || '',
      point3: product.point3 || '',
      specifications: product.specifications || [],
      subCategory: product.subCategory || 'General',
      bestseller: product.bestseller || false,
      images: [], // new uploaded files
      imageUrls: product.image || [] // existing images from cloud
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await apiService.removeProduct(productId);
        if (response.success) {
          setMessage('Product deleted successfully!');
          fetchProducts();
        } else {
          setMessage('Failed to delete product: ' + response.message);
        }
      } catch (error) {
        setMessage('Error deleting product: ' + error.message);
      }
    }
  };

  // Edit form change handlers
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSizeCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setEditProduct(prev => {
      let newSizes;
      if (checked) {
        newSizes = [...prev.sizes, value];
      } else {
        newSizes = prev.sizes.filter(size => size !== value);
      }
      return {
        ...prev,
        sizes: newSizes
      };
    });
  };

  const addEditSpecification = () => {
    setEditProduct(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeEditSpecification = (index) => {
    setEditProduct(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleEditSpecificationChange = (index, field, value) => {
    setEditProduct(prev => {
      const newSpecs = [...prev.specifications];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, specifications: newSpecs };
    });
  };

  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    setEditProduct(prev => ({
      ...prev,
      images: files
    }));
  };

  const removeExistingImage = (imgUrl) => {
    setEditProduct(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter(url => url !== imgUrl)
    }));
  };

  const handleEditSubmit = async (e) => {
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

      if (!editProduct.name || !editProduct.description || !editProduct.price) {
        setMessage('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (editProduct.sizes.length === 0) {
        setMessage('Please select at least one size');
        setLoading(false);
        return;
      }

      if (!editProduct.point1 || !editProduct.point2 || !editProduct.point3) {
        setMessage('Please fill in all three feature points');
        setLoading(false);
        return;
      }

      const productData = {
        id: editProduct.id,
        name: editProduct.name,
        description: editProduct.description,
        price: editProduct.price,
        discount: editProduct.discount,
        firmness: editProduct.firmness,
        rating: editProduct.rating,
        point1: editProduct.point1,
        point2: editProduct.point2,
        point3: editProduct.point3,
        subCategory: editProduct.subCategory || 'General',
        bestseller: editProduct.bestseller,
        sizes: JSON.stringify(editProduct.sizes),
        specifications: JSON.stringify(editProduct.specifications.filter(spec => spec.key && spec.value)),
        existingImages: JSON.stringify(editProduct.imageUrls),
        images: editProduct.images
      };

      const response = await apiService.updateProduct(productData);
      if (response.success) {
        setMessage('Product updated successfully!');
        setIsEditModalOpen(false);
        fetchProducts();
      } else {
        setMessage('Failed to update product: ' + response.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage('Error updating product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="list-header-banner">
          <h1 className="page-title">Product List</h1>
          <p>Manage NemLUXURA products. Add, edit, or delete items. Changes will sync in real-time with the frontend store.</p>
        </div>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {loading && products.length === 0 ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Sub Category</th>
                  <th>Price</th>
                  <th>Sizes</th>
                  <th>Firmness</th>
                  <th>Point 1</th>
                  <th>Point 2</th>
                  <th>Point 3</th>
                  <th>Bestseller</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="no-data">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        {product.image && product.image.length > 0 ? (
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="product-image"
                          />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>
                        <span className="category-badge">{product.category}</span>
                      </td>
                      <td>{product.subCategory}</td>
                      <td>₹{product.price}</td>
                      <td>
                        <div className="sizes-container">
                          {product.sizes && product.sizes.map((size, index) => (
                            <span key={index} className="size-badge">{size}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className="firmness-badge">{product.firmness}</span>
                      </td>
                      <td>
                        <span className="point-text">{product.point1 || 'N/A'}</span>
                      </td>
                      <td>
                        <span className="point-text">{product.point2 || 'N/A'}</span>
                      </td>
                      <td>
                        <span className="point-text">{product.point3 || 'N/A'}</span>
                      </td>
                      <td>
                        {product.bestseller ? (
                          <span className="bestseller-badge">★ Bestseller</span>
                        ) : (
                          <span className="regular-badge">Regular</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="action-btn edit"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal Overlay */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>Edit Product</h3>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="form-scroll-container">
                {/* Basic Info */}
                <div className="modal-section">
                  <h4 className="modal-section-title">Basic Information</h4>
                  <div className="edit-form-grid">
                    <div className="edit-form-group full-width">
                      <label className="edit-form-label">Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        className="edit-form-input"
                        value={editProduct.name}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="edit-form-group full-width">
                      <label className="edit-form-label">Product Description *</label>
                      <textarea
                        name="description"
                        className="edit-form-textarea"
                        rows="3"
                        value={editProduct.description}
                        onChange={handleEditChange}
                        required
                      ></textarea>
                    </div>
                    <div className="edit-form-group">
                      <label className="edit-form-label">Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        className="edit-form-input"
                        value={editProduct.price}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="edit-form-group">
                      <label className="edit-form-label">Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        className="edit-form-input"
                        min="0"
                        max="100"
                        value={editProduct.discount}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="edit-form-group">
                      <label className="edit-form-label">Firmness *</label>
                      <select
                        name="firmness"
                        className="edit-form-select"
                        value={editProduct.firmness}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="Soft">Soft</option>
                        <option value="Medium">Medium</option>
                        <option value="Firm">Firm</option>
                      </select>
                    </div>
                    <div className="edit-form-group">
                      <label className="edit-form-label">Rating</label>
                      <input
                        type="number"
                        name="rating"
                        className="edit-form-input"
                        min="1"
                        max="5"
                        step="0.1"
                        value={editProduct.rating}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="edit-form-group">
                      <label className="edit-form-label">Sub Category</label>
                      <input
                        type="text"
                        name="subCategory"
                        className="edit-form-input"
                        value={editProduct.subCategory}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="edit-form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <input
                        type="checkbox"
                        id="edit-bestseller"
                        name="bestseller"
                        checked={editProduct.bestseller}
                        onChange={handleEditChange}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <label htmlFor="edit-bestseller" className="edit-form-label" style={{ cursor: 'pointer' }}>Bestseller Product</label>
                    </div>
                  </div>
                </div>

                {/* Features & Sizes */}
                <div className="modal-section">
                  <h4 className="modal-section-title">Features & Sizes</h4>
                  <div className="edit-form-group" style={{ marginBottom: '1rem' }}>
                    <label className="edit-form-label">Available Sizes *</label>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      {['Single', 'Double', 'Queen', 'King'].map(size => (
                        <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            value={size}
                            checked={editProduct.sizes.includes(size)}
                            onChange={handleEditSizeCheckboxChange}
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span>{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="edit-form-grid">
                    <div className="edit-form-group full-width">
                      <label className="edit-form-label">Key Feature 1 *</label>
                      <input
                        type="text"
                        name="point1"
                        className="edit-form-input"
                        value={editProduct.point1}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="edit-form-group full-width">
                      <label className="edit-form-label">Key Feature 2 *</label>
                      <input
                        type="text"
                        name="point2"
                        className="edit-form-input"
                        value={editProduct.point2}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="edit-form-group full-width">
                      <label className="edit-form-label">Key Feature 3 *</label>
                      <input
                        type="text"
                        name="point3"
                        className="edit-form-input"
                        value={editProduct.point3}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                <div className="modal-section">
                  <h4 className="modal-section-title">Specifications</h4>
                  {editProduct.specifications.map((spec, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', marginBottom: '0.75rem', alignItems: 'end' }}>
                      <div className="edit-form-group">
                        <label className="edit-form-label">Key</label>
                        <input
                          type="text"
                          className="edit-form-input"
                          placeholder="e.g. Material"
                          value={spec.key}
                          onChange={(e) => handleEditSpecificationChange(index, 'key', e.target.value)}
                        />
                      </div>
                      <div className="edit-form-group">
                        <label className="edit-form-label">Value</label>
                        <input
                          type="text"
                          className="edit-form-input"
                          placeholder="e.g. Memory Foam"
                          value={spec.value}
                          onChange={(e) => handleEditSpecificationChange(index, 'value', e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEditSpecification(index)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          height: 'fit-content'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addEditSpecification}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#22327a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      marginTop: '0.5rem'
                    }}
                  >
                    + Add Specification
                  </button>
                </div>

                {/* Images */}
                <div className="modal-section">
                  <h4 className="modal-section-title">Product Images</h4>

                  {/* Existing Images */}
                  {editProduct.imageUrls.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <label className="edit-form-label">Current Images (click X to remove)</label>
                      <div className="edit-images-preview-grid">
                        {editProduct.imageUrls.map((url, index) => (
                          <div key={index} className="edit-image-card">
                            <img src={url} alt="product" />
                            <button
                              type="button"
                              className="remove-img-btn"
                              onClick={() => removeExistingImage(url)}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Uploads */}
                  <div className="edit-form-group">
                    <label className="edit-form-label">Upload New Images (Replacing/Appending)</label>
                    <input
                      type="file"
                      onChange={handleEditImageChange}
                      accept="image/*"
                      multiple
                      className="edit-form-input"
                    />
                    {editProduct.images.length > 0 && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {editProduct.images.map((file, idx) => (
                          <span key={idx} style={{ padding: '0.25rem 0.5rem', background: '#e2e8f0', borderRadius: '4px', fontSize: '0.8rem' }}>
                            {file.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default List;
