import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import '../CSS/OrdersInfo.css';

const OrdersInfo = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Tab and filter states
  const [activeTab, setActiveTab] = useState('Retail'); // 'Retail' or 'Bulk'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'Pending', 'Read', 'Replied', 'Archived'

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await apiService.getInquiries();
      if (data.success) {
        setInquiries(data.inquiries);
      } else {
        setError(data.message || 'Failed to fetch inquiries');
      }
    } catch (err) {
      setError('Error fetching inquiries: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (inquiryId, status) => {
    try {
      const data = await apiService.updateInquiryStatus(inquiryId, status);
      if (data.success) {
        setMessage(`Inquiry marked as ${status} successfully`);
        // Update local state directly to prevent full reload
        setInquiries(prev => prev.map(inq => inq._id === inquiryId ? { ...inq, status } : inq));
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to update inquiry');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error updating status: ' + err.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteInquiry = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry permanently?')) {
      return;
    }

    try {
      const data = await apiService.deleteInquiry(inquiryId);
      if (data.success) {
        setMessage('Inquiry deleted successfully');
        setInquiries(prev => prev.filter(inq => inq._id !== inquiryId));
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to delete inquiry');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error deleting inquiry: ' + err.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Metrics helper
  const totalCount = inquiries.length;
  const retailCount = inquiries.filter(inq => inq.type === 'Retail').length;
  const bulkCount = inquiries.filter(inq => inq.type === 'Bulk').length;
  const pendingCount = inquiries.filter(inq => inq.status === 'Pending').length;
  const pendingRetailCount = inquiries.filter(inq => inq.type === 'Retail' && inq.status === 'Pending').length;
  const pendingBulkCount = inquiries.filter(inq => inq.type === 'Bulk' && inq.status === 'Pending').length;

  // Filter logic
  const filteredInquiries = inquiries.filter(inq => {
    const matchesTab = inq.type === activeTab;
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    return matchesTab && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ff9f43';
      case 'Read': return '#54a0ff';
      case 'Replied': return '#10ac84';
      case 'Archived': return '#8395a7';
      default: return '#576574';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return '✉️';
      case 'Read': return '👀';
      case 'Replied': return '✅';
      case 'Archived': return '📦';
      default: return '❓';
    }
  };

  return (
    <div className="orders-info-container">
      {/* Header Banner */}
      <div className="orders-info-header">
        <h1>Orders Inquiry Information</h1>
        <p>View and manage client inquiries submitted from the Contact page. Double-click or use the action buttons to update inquiry states.</p>
      </div>

      {/* Metrics Dashboard Row */}
      <div className="orders-info-metrics-row">
        <div className="metric-card metric-total-info">
          <span className="metric-title">Total Inquiries</span>
          <span className="metric-value">{totalCount}</span>
        </div>
        <div className="metric-card metric-retail-info">
          <span className="metric-title">Retail Enquiries</span>
          <span className="metric-value">{retailCount}</span>
        </div>
        <div className="metric-card metric-bulk-info">
          <span className="metric-title">Bulk Enquiries</span>
          <span className="metric-value">{bulkCount}</span>
        </div>
        <div className="metric-card metric-pending-info">
          <span className="metric-title">Pending Action</span>
          <span className="metric-value">{pendingCount}</span>
        </div>
      </div>

      {/* Alert Banner */}
      {message && (
        <div className={`message-banner ${message.toLowerCase().includes('success') || message.toLowerCase().includes('marked') ? 'success' : 'error'}`}>
          <span>{message}</span>
        </div>
      )}

      {/* Main Section Navigation (Retail vs Bulk Tabs) */}
      <div className="section-tabs-container">
        <button
          className={`section-tab-btn ${activeTab === 'Retail' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('Retail');
            setStatusFilter('all');
          }}
        >
          🛍️ Retail Inquiries Card
          {pendingRetailCount > 0 && <span className="tab-badge">{pendingRetailCount}</span>}
        </button>
        <button
          className={`section-tab-btn ${activeTab === 'Bulk' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('Bulk');
            setStatusFilter('all');
          }}
        >
          🏢 Bulk Inquiries Card
          {pendingBulkCount > 0 && <span className="tab-badge">{pendingBulkCount}</span>}
        </button>
      </div>

      {/* Filters pill badges for state */}
      <div className="orders-info-filters">
        <button
          className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All <span className="filter-count">{inquiries.filter(i => i.type === activeTab).length}</span>
        </button>
        <button
          className={`filter-btn ${statusFilter === 'Pending' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Pending')}
        >
          Pending <span className="filter-count">{inquiries.filter(i => i.type === activeTab && i.status === 'Pending').length}</span>
        </button>
        <button
          className={`filter-btn ${statusFilter === 'Read' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Read')}
        >
          Read <span className="filter-count">{inquiries.filter(i => i.type === activeTab && i.status === 'Read').length}</span>
        </button>
        <button
          className={`filter-btn ${statusFilter === 'Replied' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Replied')}
        >
          Replied <span className="filter-count">{inquiries.filter(i => i.type === activeTab && i.status === 'Replied').length}</span>
        </button>
        <button
          className={`filter-btn ${statusFilter === 'Archived' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Archived')}
        >
          Archived <span className="filter-count">{inquiries.filter(i => i.type === activeTab && i.status === 'Archived').length}</span>
        </button>
      </div>

      {/* Inquiry Content Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading inquiries...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchInquiries} className="retry-btn">Retry</button>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="no-inquiries-box">
          <svg className="no-inquiries-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <p>No inquiries found for this section or filter.</p>
        </div>
      ) : (
        <div className="inquiry-grid">
          {filteredInquiries.map(inq => (
            <div key={inq._id} className={`inquiry-card status-${inq.status.toLowerCase()}`}>
              <div className="card-top">
                <span className="inq-date">{new Date(inq.date).toLocaleString()}</span>
                <span className="status-badge" style={{ backgroundColor: getStatusColor(inq.status) + '15', color: getStatusColor(inq.status) }}>
                  {getStatusIcon(inq.status)} {inq.status}
                </span>
              </div>

              <div className="card-sender-info">
                <h3>{inq.name}</h3>
                <a href={`mailto:${inq.email}`} className="sender-email" title="Click to send email">
                  ✉️ {inq.email}
                </a>
              </div>

              <div className="card-inquiry-details">
                <div className="inq-subject">
                  <strong>Subject:</strong> {inq.subject}
                </div>
                <div className="inq-message">
                  <strong>Message:</strong>
                  <p>{inq.message}</p>
                </div>
              </div>

              <div className="card-actions">
                {inq.status === 'Pending' && (
                  <button
                    className="action-btn read-btn"
                    onClick={() => updateStatus(inq._id, 'Read')}
                  >
                    Mark Read
                  </button>
                )}
                {inq.status !== 'Replied' && (
                  <button
                    className="action-btn reply-btn"
                    onClick={() => updateStatus(inq._id, 'Replied')}
                  >
                    Mark Replied
                  </button>
                )}
                {inq.status !== 'Archived' && (
                  <button
                    className="action-btn archive-btn"
                    onClick={() => updateStatus(inq._id, 'Archived')}
                  >
                    Archive
                  </button>
                )}
                {inq.status === 'Archived' && (
                  <button
                    className="action-btn read-btn"
                    onClick={() => updateStatus(inq._id, 'Pending')}
                  >
                    Restore
                  </button>
                )}
                <button
                  className="action-btn delete-btn"
                  onClick={() => deleteInquiry(inq._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersInfo;
