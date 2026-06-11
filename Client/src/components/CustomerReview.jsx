import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import '../CSS/components/CustomerReview.css';

const CustomerReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback static reviews
  const fallbackReviews = [
    {
      id: 1,
      rating: 5,
      text: "10 years of back pain gone! The Luxura's comfort and support have truly transformed my sleep quality.",
      name: "Rahul Mehta",
      location: "Mumbai"
    },
    {
      id: 2,
      rating: 5,
      text: "Incredible quality and comfort. The cooling technology really works - no more hot, restless nights. Highly recommend!",
      name: "Rajesh Patel",
      location: "Delhi"
    },
    {
      id: 3,
      rating: 5,
      text: "Worth every penny. The 100-night trial gave us confidence to try it, and we're so glad we did. Amazing customer service too.",
      name: "Priya Sharma",
      location: "Bangalore"
    },
    {
      id: 4,
      rating: 5,
      text: "Revolutionary sleep experience. This mattress adapts perfectly, and I wake up refreshed every single day now.",
      name: "Amit Kumar",
      location: "Chennai"
    },
    {
      id: 5,
      rating: 5,
      text: "Best investment in my health! The memory foam is perfect, and the temperature regulation keeps me comfortable all night.",
      name: "Sneha Reddy",
      location: "Hyderabad"
    },
    {
      id: 6,
      rating: 5,
      text: "Finally found the perfect mattress! No more tossing and turning. The support is incredible and I sleep through the night.",
      name: "Vikram Singh",
      location: "Pune"
    }
  ];

  useEffect(() => {
    const fetchHomeReviews = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';
        const response = await fetch(`${API_BASE_URL}/review/home`);
        
        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        
        const data = await response.json();
        
        if (data.success && data.reviews && data.reviews.length > 0) {
          // Transform API reviews to match component format
          const transformedReviews = data.reviews.map((review, index) => ({
            id: review._id || index,
            rating: review.rating || 5,
            text: review.reviewText || review.reviewTitle || '',
            name: review.userName || 'Anonymous',
            location: review.state || 'India'
          }));
          setReviews(transformedReviews);
        } else {
          // Use fallback if no reviews found
          setReviews(fallbackReviews);
        }
      } catch (error) {
        console.error('Error fetching home reviews:', error);
        // Use fallback on error
        setReviews(fallbackReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeReviews();
  }, []);

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  // Use dynamic reviews or fallback, duplicate for seamless infinite loop
  const reviewsToShow = reviews.length > 0 ? reviews : fallbackReviews;
  const duplicatedReviews = [...reviewsToShow, ...reviewsToShow, ...reviewsToShow];

  return (
    <section className="section-customerreview">
      <div className="header-customerreview">
        <h2 className="title-customerreview">What Our Customers Say</h2>
        <p className="subtitle-customerreview">
          Join thousands of happy sleepers who've transformed their nights
        </p>
      </div>

      <div className="slider-wrapper-customerreview">
        <div className="slider-track-customerreview">
          {duplicatedReviews.map((review, index) => (
            <div 
              key={`${review.id}-${index}`}
              className="card-customerreview"
            >
              <div className="stars-customerreview">
                {renderStars(review.rating)}
              </div>
              <p className="text-customerreview">"{review.text}"</p>
              <div className="author-customerreview">
                <p className="name-customerreview">{review.name}</p>
                <p className="location-customerreview">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReview;