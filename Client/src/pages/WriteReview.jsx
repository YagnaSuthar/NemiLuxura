import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import "../CSS/pages/WriteReview.css";
import image_3 from "../assets/image_3.jpg";
const WriteReview = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    product: "",
    rating: 0,
    yourName: "",
    email: "",
    state: "",
    reviewTitle: "",
    reviewText: "",
  });

  const [hoveredRating, setHoveredRating] = useState(0);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiService.getProducts();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating: rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.product ||
      !formData.rating ||
      !formData.yourName ||
      !formData.email ||
      !formData.state ||
      !formData.reviewTitle ||
      !formData.reviewText
    ) {
      setMessage("Please fill in all fields");
      return;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      setMessage("Please select a rating between 1 and 5 stars");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Check if it's a static product (foam/mattress/pillow) or database product
      const staticProductNames = {
        foam: "Foam",
        mattress: "Mattress",
        pillow: "Pillow",
      };

      const isStaticProduct = ['foam', 'mattress', 'pillow'].includes(formData.product?.toLowerCase());
      const selectedStaticName = isStaticProduct ? staticProductNames[formData.product.toLowerCase()] : null;
      const selectedProduct = !isStaticProduct ? products.find((p) => p._id === formData.product) : null;

      const reviewData = {
        productId: isStaticProduct ? null : formData.product,
        productName: selectedStaticName || (selectedProduct ? selectedProduct.name : "Unknown Product"),
        productType: isStaticProduct ? formData.product.toLowerCase() : 'other',
        userName: formData.yourName,
        userEmail: formData.email,
        state: formData.state,
        rating: formData.rating,
        reviewTitle: formData.reviewTitle,
        reviewText: formData.reviewText,
      };

      const result = await apiService.submitReview(reviewData);

      if (result.success) {
        setMessage(
          "Review submitted successfully! Thank you for your feedback."
        );
        setFormData({
          product: "",
          rating: 0,
          yourName: "",
          email: "",
          state: "",
          reviewTitle: "",
          reviewText: "",
        });
        setHoveredRating(0);
      } else {
        setMessage(
          result.message || "Failed to submit review. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("Error submitting review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-page-writereview">
      {/* Hero Section */}
      <div className="hero-section-writereview">
        <div className="hero-overlay-writereview"></div>
        <div className="hero-content-writereview">
          <h1 className="hero-title-writereview">Share Your Experience</h1>
          <p className="hero-subtitle-writereview">
            Help others make the right choice by sharing your honest review
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-container-writereview">
        <div className="form-wrapper-writereview">
          {/* Left Side - Form */}
          <div className="form-card-writereview">
            <h2 className="form-title-writereview">Write Your Review</h2>

            <form onSubmit={handleSubmit}>
              {/* Product Selection */}
              <div className="form-group-writereview">
                <label className="form-label-writereview">Product</label>
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  className="form-select-writereview"
                  required
                >
                  <option value="">Select a product</option>

                  {/* Dynamic products from database */}
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="form-group-writereview">
                <label className="form-label-writereview">Rating</label>
                <div className="star-rating-writereview">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star-writereview ${star <= (hoveredRating || formData.rating)
                          ? "filled-writereview"
                          : ""
                        }`}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Name and Email */}
              <div className="form-row-writereview">
                <div className="form-group-writereview">
                  <label className="form-label-writereview">Your Name</label>
                  <input
                    type="text"
                    name="yourName"
                    value={formData.yourName}
                    onChange={handleInputChange}
                    className="form-input-writereview"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group-writereview">
                  <label className="form-label-writereview">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input-writereview"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* State */}
              <div className="form-group-writereview">
                <label className="form-label-writereview">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="form-input-writereview"
                  placeholder="e.g., Maharashtra, Delhi, Karnataka"
                  required
                />
              </div>

              {/* Review Title */}
              <div className="form-group-writereview">
                <label className="form-label-writereview">Review Title</label>
                <input
                  type="text"
                  name="reviewTitle"
                  value={formData.reviewTitle}
                  onChange={handleInputChange}
                  className="form-input-writereview"
                  placeholder="Best sleep I've ever had!"
                  required
                />
              </div>

              {/* Review Text */}
              <div className="form-group-writereview">
                <label className="form-label-writereview">Your Review</label>
                <textarea
                  name="reviewText"
                  value={formData.reviewText}
                  onChange={handleInputChange}
                  className="form-textarea-writereview"
                  placeholder="Tell us about your experience with your Luxura mattress..."
                  rows="6"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn-writereview"
                disabled={loading}
              >
                {loading ? "Submitting..." : "📝 Submit Review"}
              </button>

              {/* Message Display */}
              {message && (
                <div
                  className={`message-writereview ${message.includes("successfully") ? "success" : "error"
                    }`}
                >
                  {message}
                </div>
              )}
            </form>
          </div>

          {/* Right Side - Info */}
          <div className="info-section-writereview">
            <div className="info-card-writereview">
              <h3 className="info-title-writereview">
                Why Your Review Matters
              </h3>
              <ul className="info-list-writereview">
                <li className="info-item-writereview">
                  Help other customers make informed decisions
                </li>
                <li className="info-item-writereview">
                  Share your honest experience with our products
                </li>
                <li className="info-item-writereview">
                  Help us improve our products and services
                </li>
              </ul>
            </div>

            <div className="community-card-writereview">
              <img
                src={image_3}
                alt="Community"
                className="community-image-writereview"
              />
              <div className="community-overlay-writereview">
                <h3 className="community-title-writereview">
                  Join Our Community
                </h3>
                <p className="community-text-writereview">
                  Over 10,000 happy customers have shared their stories
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteReview;
