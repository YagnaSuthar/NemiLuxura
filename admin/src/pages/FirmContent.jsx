import React, { useEffect, useState } from "react";
import apiService from "../services/apiService";
import "../CSS/FirmContent.css";

const FirmContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [foamItem, setFoamItem] = useState({ title: "", stock: "" });
  const [mattressItem, setMattressItem] = useState({ title: "", description: "" });

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await apiService.getFirmContent();
      if (data.success) {
        setContent(data);
      }
    } catch (err) {
      console.error("Error loading firm content:", err);
      setMessage("Error loading content: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleHeroChange = async (section, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setMessage("");
      await apiService.upsertFirmHero(section, file);
      setMessage("Hero image updated successfully");
      await loadContent();
    } catch (err) {
      console.error("Error updating hero image:", err);
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleAddFoam = async (e) => {
    e.preventDefault();
    if (!foamItem.title) return;

    try {
      setLoading(true);
      setMessage("");
      await apiService.upsertFirmItem({
        section: "foamItem",
        title: foamItem.title,
        stock: foamItem.stock || "In Stock",
      });
      setFoamItem({ title: "", stock: "" });
      setMessage("Foam item added");
      await loadContent();
    } catch (err) {
      console.error("Error adding foam item:", err);
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMattress = async (e) => {
    e.preventDefault();
    if (!mattressItem.title || !mattressItem.description) return;

    try {
      setLoading(true);
      setMessage("");
      await apiService.upsertFirmItem({
        section: "mattressItem",
        title: mattressItem.title,
        description: mattressItem.description,
      });
      setMattressItem({ title: "", description: "" });
      setMessage("Mattress item added");
      await loadContent();
    } catch (err) {
      console.error("Error adding mattress item:", err);
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      setLoading(true);
      setMessage("");
      await apiService.deleteFirmItem(id);
      setMessage("Item deleted");
      await loadContent();
    } catch (err) {
      console.error("Error deleting firm item:", err);
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="firm-container">
      {/* Header Banner */}
      <div className="firm-header">
        <div className="firm-header-content">
          <h1 className="firm-header-title">Firm Page Content</h1>
          <p className="firm-header-subtitle">
            Manage hero images and product listings for Foam, Mattress, and Pillow sections.
          </p>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div
          className={`firm-alert ${message.toLowerCase().includes("error")
            ? "firm-alert-error"
            : "firm-alert-success"
            }`}
        >
          <div className="firm-alert-icon">
            {message.toLowerCase().includes("error") ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}
          </div>
          <span>{message}</span>
          <button
            className="firm-alert-close"
            onClick={() => setMessage("")}
          >
            &times;
          </button>
        </div>
      )}

      {/* Hero Images Section */}
      <div className="firm-section">
        <div className="firm-section-header">
          <h2 className="firm-section-title">Hero Images</h2>
        </div>

        <div className="firm-grid">
          {["foam", "mattress", "pillow"].map((type) => {
            const key = `${type}Hero`;
            const hero = content && content[key];
            return (
              <div key={type} className="hero-card">
                <div className="hero-image-wrapper">
                  {hero && hero.imageUrl ? (
                    <img src={hero.imageUrl} alt={`${type} hero`} />
                  ) : (
                    <div className="hero-empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>No {type} hero image yet</span>
                    </div>
                  )}
                  <div className="hero-overlay">
                    <label className="hero-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleHeroChange(`${type}Hero`, e)}
                        disabled={loading}
                      />
                      {hero && hero.imageUrl ? "Change Image" : "Upload Image"}
                    </label>
                  </div>
                </div>
                <p className="hero-label">
                  {type.charAt(0).toUpperCase() + type.slice(1)} Hero
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Foam Items Section */}
      <div className="firm-section">
        <div className="firm-section-header">
          <h2 className="firm-section-title">Foam Items</h2>
        </div>

        {/* Add Foam Form */}
        <div className="firm-form-card">
          <form className="firm-form-grid" onSubmit={handleAddFoam}>
            <div className="firm-form-group">
              <label className="firm-form-label">Foam Name</label>
              <input
                type="text"
                placeholder="e.g. Memory Foam, Latex Foam"
                value={foamItem.title}
                onChange={(e) =>
                  setFoamItem({ ...foamItem, title: e.target.value })
                }
                className="firm-form-input"
                required
              />
            </div>
            <div className="firm-form-group">
              <label className="firm-form-label">Stock Status</label>
              <input
                type="text"
                placeholder="e.g. In Stock, Out of Stock"
                value={foamItem.stock}
                onChange={(e) =>
                  setFoamItem({ ...foamItem, stock: e.target.value })
                }
                className="firm-form-input"
              />
            </div>
            <button
              type="submit"
              className="firm-submit-btn"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Foam
            </button>
          </form>
        </div>

        {/* Foam Grid */}
        <div className="firm-grid">
          {content &&
            content.foams &&
            Array.isArray(content.foams) &&
            content.foams.length > 0 ? (
            content.foams.map((foam) => (
              <div key={foam._id} className="item-card item-card-foam">
                <div className="item-card-header">
                  <div className="item-icon-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    className="item-delete-btn"
                    onClick={() => handleDeleteItem(foam._id)}
                    disabled={loading}
                    title="Delete foam item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
                <div className="item-card-body">
                  <h3 className="item-title">{foam.name}</h3>
                </div>
                <div className="item-card-footer">
                  <span className={`stock-badge ${foam.stock.toLowerCase().includes('out') ? 'stock-badge-custom' : 'stock-badge-instock'}`}>
                    {foam.stock || 'In Stock'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="list-empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>No foam items added yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mattress Items Section */}
      <div className="firm-section">
        <div className="firm-section-header">
          <h2 className="firm-section-title">Mattress Items</h2>
        </div>

        {/* Add Mattress Form */}
        <div className="firm-form-card">
          <form className="firm-form-grid" onSubmit={handleAddMattress}>
            <div className="firm-form-group">
              <label className="firm-form-label">Mattress Name</label>
              <input
                type="text"
                placeholder="e.g. Ortho Comfort, Pocket Spring"
                value={mattressItem.title}
                onChange={(e) =>
                  setMattressItem({ ...mattressItem, title: e.target.value })
                }
                className="firm-form-input"
                required
              />
            </div>
            <div className="firm-form-group">
              <label className="firm-form-label">Description</label>
              <input
                type="text"
                placeholder="e.g. Multi-layered orthopedic mattress for back support"
                value={mattressItem.description}
                onChange={(e) =>
                  setMattressItem({
                    ...mattressItem,
                    description: e.target.value,
                  })
                }
                className="firm-form-input"
                required
              />
            </div>
            <button
              type="submit"
              className="firm-submit-btn"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Mattress
            </button>
          </form>
        </div>

        {/* Mattress Grid */}
        <div className="firm-grid">
          {content &&
            content.mattresses &&
            Array.isArray(content.mattresses) &&
            content.mattresses.length > 0 ? (
            content.mattresses.map((m) => (
              <div key={m._id} className="item-card item-card-mattress">
                <div className="item-card-header">
                  <div className="item-icon-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 4v16" />
                      <path d="M2 8h20" />
                      <path d="M22 4v16" />
                      <path d="M2 12h20" />
                      <path d="M2 16h20" />
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    className="item-delete-btn"
                    onClick={() => handleDeleteItem(m._id)}
                    disabled={loading}
                    title="Delete mattress item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
                <div className="item-card-body">
                  <h3 className="item-title">{m.name}</h3>
                  <p className="item-description">{m.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="list-empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>No mattress items added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirmContent;


