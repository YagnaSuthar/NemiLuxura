import React, { useState, useEffect } from "react";
import apiService from '../services/apiService';
import '../CSS/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrders();
      if (response.success) {
        setOrders(response.orders);
      } else {
        setMessage('Failed to fetch orders: ' + response.message);
      }
    } catch (error) {
      setMessage('Error fetching orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiService.getOrderStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleView = async (orderId) => {
    try {
      const response = await apiService.getOrderDetails(orderId);
      if (response.success) {
        setSelectedOrder(response.order);
        setShowDetails(true);
      } else {
        setMessage('Failed to fetch order details: ' + response.message);
      }
    } catch (error) {
      setMessage('Error fetching order details: ' + error.message);
    }
  };

  const handleUpdate = async (orderId, newStatus) => {
    try {
      const response = await apiService.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        setMessage('Order status updated successfully!');
        fetchOrders(); // Refresh orders list
        fetchStats(); // Refresh stats
        setShowDetails(false); // Close details modal
      } else {
        setMessage('Failed to update order status: ' + response.message);
      }
    } catch (error) {
      setMessage('Error updating order status: ' + error.message);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "status-delivered";
      case "shipped":
        return "status-shipped";
      case "processing":
        return "status-processing";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-pending";
    }
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <h2 className="page-title">Orders Management</h2>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="stats-container">
            <div className="stat-card">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
            <div className="stat-card">
              <h3>{stats.pendingOrders}</h3>
              <p>Pending</p>
            </div>
            <div className="stat-card">
              <h3>{stats.processingOrders}</h3>
              <p>Processing</p>
            </div>
            <div className="stat-card">
              <h3>{stats.shippedOrders}</h3>
              <p>Shipped</p>
            </div>
            <div className="stat-card">
              <h3>{stats.deliveredOrders}</h3>
              <p>Delivered</p>
            </div>
            <div className="stat-card">
              <h3>₹{stats.totalRevenue}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                      </td>
                      <td>
                        <div>
                          <div className="customer-name">{order.userId?.name}</div>
                          <div className="customer-email">{order.userId?.email}</div>
                        </div>
                      </td>
                      <td>{order.products.length}</td>
                      <td>₹{order.totalAmount}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className="action-btn view"
                          onClick={() => handleView(order._id)}
                        >
                          View
                        </button>
                        <button
                          className="action-btn update"
                          onClick={() => handleView(order._id)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <div className="modal-overlay" onClick={() => setShowDetails(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Order Details - #{selectedOrder._id.slice(-6).toUpperCase()}</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowDetails(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="order-info">
                  <div className="info-section">
                    <h4>Customer Information</h4>
                    <p><strong>Name:</strong> {selectedOrder.userId?.name}</p>
                    <p><strong>Email:</strong> {selectedOrder.userId?.email}</p>
                  </div>

                  <div className="info-section">
                    <h4>Shipping Address</h4>
                    <p><strong>Name:</strong> {selectedOrder.shippingAddress.name}</p>
                    <p><strong>Address:</strong> {selectedOrder.shippingAddress.address}</p>
                    <p><strong>City:</strong> {selectedOrder.shippingAddress.city}</p>
                    <p><strong>State:</strong> {selectedOrder.shippingAddress.state}</p>
                    <p><strong>Pincode:</strong> {selectedOrder.shippingAddress.pincode}</p>
                    <p><strong>Phone:</strong> {selectedOrder.shippingAddress.phone}</p>
                  </div>

                  <div className="info-section">
                    <h4>Order Items</h4>
                    {selectedOrder.products.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-image">
                          {item.productId?.image && item.productId.image.length > 0 ? (
                            <img src={item.productId.image[0]} alt={item.productId.name} />
                          ) : (
                            <div className="no-image">No Image</div>
                          )}
                        </div>
                        <div className="item-details">
                          <h5>{item.productId?.name}</h5>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: ₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="info-section">
                    <h4>Order Summary</h4>
                    <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}</p>
                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                    <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                    <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                    {selectedOrder.deliveryDate && (
                      <p><strong>Delivery Date:</strong> {new Date(selectedOrder.deliveryDate).toLocaleString()}</p>
                    )}
                  </div>
                </div>

                <div className="status-update">
                  <h4>Update Status</h4>
                  <div className="status-buttons">
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                      <button
                        key={status}
                        className={`status-btn ${selectedOrder.status === status ? 'active' : ''}`}
                        onClick={() => handleUpdate(selectedOrder._id, status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;