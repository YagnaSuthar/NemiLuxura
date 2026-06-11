import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import '../CSS/Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api'}/review/all`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
      } else {
        setError('Failed to fetch reviews');
      }
    } catch (err) {
      setError('Error fetching reviews: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId, status, showOnHome) => {
    try {
      const body = {};
      if (status !== undefined) body.status = status;
      if (showOnHome !== undefined) body.showOnHome = showOnHome;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api'}/review/status/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        if (status) {
          setMessage(`Review ${status} successfully`);
        } else if (showOnHome !== undefined) {
          setMessage(`Review ${showOnHome ? 'added to' : 'removed from'} home screen`);
        }
        fetchReviews(); // Refresh the list
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update review');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error updating review');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const toggleShowOnHome = async (reviewId, currentValue) => {
    await updateReviewStatus(reviewId, undefined, !currentValue);
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api'}/review/delete/${reviewId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Review deleted successfully');
        fetchReviews(); // Refresh the list
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to delete review');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error deleting review');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '❓';
    }
  };

  // Filter reviews - only show product-oriented reviews (those with productId)
  const productReviews = reviews.filter(review => review.productId);

  const filteredReviews = productReviews.filter(review => {
    if (filter === 'all') return true;
    return review.status === filter;
  });

  if (loading) {
    return (
      <div className="reviews-container">
        <div className="loading-box">
          <div className="loading-spinner-reviews"></div>
          <p>Loading product reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-container">
        <div className="error-box">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Metrics Dashboard Summary
  const totalCount = productReviews.length;
  const pendingCount = productReviews.filter(r => r.status === 'pending').length;
  const approvedCount = productReviews.filter(r => r.status === 'approved').length;
  const rejectedCount = productReviews.filter(r => r.status === 'rejected').length;

  return (
    <div className="reviews-container">
      {/* Header Banner */}
      <div className="reviews-header">
        <h1>Product Reviews Management</h1>
        <p>Manage product reviews. Approved reviews appear on product detail pages. Toggle "Show on Home" to display them on the homepage.</p>
      </div>

      {/* Metrics Row */}
      <div className="reviews-metrics-row">
        <div className="metric-card metric-total">
          <span className="metric-title">Total Reviews</span>
          <span className="metric-value">{totalCount}</span>
        </div>
        <div className="metric-card metric-pending">
          <span className="metric-title">Pending</span>
          <span className="metric-value">{pendingCount}</span>
        </div>
        <div className="metric-card metric-approved">
          <span className="metric-title">Approved</span>
          <span className="metric-value">{approvedCount}</span>
        </div>
        <div className="metric-card metric-rejected">
          <span className="metric-title">Rejected</span>
          <span className="metric-value">{rejectedCount}</span>
        </div>
      </div>

      {/* Alerts */}
      {message && (
        <div className={`message ${message.toLowerCase().includes('success') || message.toLowerCase().includes('added') || message.toLowerCase().includes('removed') ? 'success' : 'error'}`}>
          <span>{message}</span>
        </div>
      )}

      {/* Filters pill badges */}
      <div className="reviews-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All <span className="filter-count">{totalCount}</span>
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending <span className="filter-count">{pendingCount}</span>
        </button>
        <button
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved <span className="filter-count">{approvedCount}</span>
        </button>
        <button
          className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected <span className="filter-count">{rejectedCount}</span>
        </button>
      </div>

      {/* Review List */}
      <div className="reviews-list">
        {filteredReviews.length === 0 ? (
          <div className="no-reviews-box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>No reviews found for the selected filter.</p>
          </div>
        ) : (
          filteredReviews.map(review => (
            <div key={review._id} className={`review-card status-${review.status}`}>
              <div className="review-header">
                <div className="review-info">
                  <h3 className="review-title">{review.reviewTitle}</h3>
                  <div className="product-badge">
                    <span>📦 Product: {review.productName}</span>
                  </div>
                  <div className="reviewer-details-row">
                    <div className="reviewer-item">
                      <span className="reviewer-item-label">By:</span>
                      <span className="reviewer-item-value">{review.userName}</span>
                    </div>
                    <div className="reviewer-item">
                      <span className="reviewer-item-label">Email:</span>
                      <span className="reviewer-item-value">{review.userEmail}</span>
                    </div>
                    {review.state && (
                      <div className="reviewer-item">
                        <span className="reviewer-item-label">State:</span>
                        <span className="reviewer-item-value">{review.state}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="review-meta">
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`star-svg ${i < review.rating ? 'filled' : ''}`}
                        viewBox="0 0 24 24"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <span className={`status-badge status-badge-${review.status}`}>
                    {review.status}
                  </span>
                  <div className="review-date">
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="review-content">
                <p className="review-text">{review.reviewText}</p>
              </div>

              <div className="review-actions">
                {review.status === 'pending' && (
                  <>
                    <button
                      className="review-action-btn btn-approve"
                      onClick={() => updateReviewStatus(review._id, 'approved')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Approve
                    </button>
                    <button
                      className="review-action-btn btn-reject"
                      onClick={() => updateReviewStatus(review._id, 'rejected')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Reject
                    </button>
                  </>
                )}

                {review.status === 'approved' && (
                  <>
                    <button
                      className="review-action-btn btn-reject"
                      onClick={() => updateReviewStatus(review._id, 'rejected')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Reject
                    </button>
                    <button
                      className={`review-action-btn ${review.showOnHome ? 'btn-home-active' : 'btn-home'}`}
                      onClick={() => toggleShowOnHome(review._id, review.showOnHome)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      {review.showOnHome ? 'On Home' : 'Show on Home'}
                    </button>
                  </>
                )}

                {review.status === 'rejected' && (
                  <button
                    className="review-action-btn btn-approve"
                    onClick={() => updateReviewStatus(review._id, 'approved')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Approve
                  </button>
                )}

                <button
                  className="review-action-btn btn-delete"
                  onClick={() => deleteReview(review._id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
