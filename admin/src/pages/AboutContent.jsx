import React, { useEffect, useState } from "react";
import apiService from "../services/apiService";
import "../CSS/Homepageimg.css"; // Reuse similar styles

const AboutContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("hero");
  const [uploadingTeamIndex, setUploadingTeamIndex] = useState(null);

  // Team member names (static, for reference)
  const teamMembers = [
    { index: 0, name: "Mr. Chetan Shah", position: "Founder Director" },
    { index: 1, name: "Mr. Dhruv Shah", position: "Director" },
    { index: 2, name: "Mr. Apurva Desai", position: "Founder Director" },
    { index: 3, name: "Mr. Alok Desai", position: "Founder Director" },
  ];

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAboutContent();
      if (data.success) {
        setContent(data);
      }
    } catch (err) {
      console.error("Error loading about images:", err);
      setMessage("Error loading images: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleHeroImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setMessage("");
      await apiService.upsertAboutHeroImage(file);
      setMessage("Hero image updated successfully");
      await loadContent();
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleTeamImageChange = async (teamMemberIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingTeamIndex(teamMemberIndex);
      setMessage("");

      // Check if image already exists for this team member
      const existingImage = content?.teamImages?.find(
        (img) => img.teamMemberIndex === teamMemberIndex
      );

      await apiService.upsertTeamImage(file, teamMemberIndex, existingImage?._id);
      setMessage(`Team image for ${teamMembers[teamMemberIndex].name} updated successfully`);
      await loadContent();
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setUploadingTeamIndex(null);
      e.target.value = "";
    }
  };

  const handleDeleteTeamImage = async (itemId, teamMemberIndex) => {
    if (!window.confirm(`Delete image for ${teamMembers[teamMemberIndex].name}?`)) return;

    try {
      setLoading(true);
      setMessage("");
      await apiService.deleteAboutItem(itemId);
      setMessage("Team image deleted successfully");
      await loadContent();
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container-homepageimg">
      <div className="page-header-homepageimg">
        <div className="header-content-homepageimg">
          <h1 className="page-title-homepageimg">About Page Images</h1>
          <p className="page-subtitle-homepageimg">
            Manage images for the About page (Hero image and Team member images)
          </p>
        </div>
      </div>

      <div className="page-content-homepageimg">
        {message && (
          <div
            className={`message-homepageimg ${message.toLowerCase().includes("error") ? "error-homepageimg" : "success-homepageimg"
              }`}
          >
            <div className="message-icon-homepageimg">
              {message.toLowerCase().includes("error") ? "⚠" : "✓"}
            </div>
            <span>{message}</span>
            <button className="message-close-homepageimg" onClick={() => setMessage("")}>
              ×
            </button>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("hero")}
            style={{
              padding: "0.75rem 1.5rem",
              background: activeTab === "hero" ? "#22327a" : "#f8f9fa",
              color: activeTab === "hero" ? "white" : "#22327a",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: activeTab === "hero" ? "600" : "400",
            }}
          >
            Hero Image
          </button>
          <button
            onClick={() => setActiveTab("team")}
            style={{
              padding: "0.75rem 1.5rem",
              background: activeTab === "team" ? "#22327a" : "#f8f9fa",
              color: activeTab === "team" ? "white" : "#22327a",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: activeTab === "team" ? "600" : "400",
            }}
          >
            Team Images
          </button>
        </div>

        {/* Hero Image Tab */}
        {activeTab === "hero" && (
          <div className="section-homepageimg">
            <div className="section-header-homepageimg">
              <h2 className="section-title-homepageimg">Hero Image (Mission/Vision Section)</h2>
            </div>
            <div className="featured-image-container-homepageimg">
              {content?.heroImage ? (
                <div className="image-card-homepageimg featured-card-homepageimg">
                  <div className="image-wrapper-homepageimg">
                    <img src={content.heroImage.imageUrl} alt="Hero" />
                    <div className="image-overlay-homepageimg">
                      <label className="change-image-btn-homepageimg">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroImageChange}
                          disabled={loading}
                          style={{ display: "none" }}
                        />
                        Change Image
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-state-homepageimg">
                  <p>No hero image set. Upload one to get started.</p>
                  <label className="upload-btn-homepageimg" style={{ marginTop: "1rem", display: "inline-block" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageChange}
                      disabled={loading}
                      style={{ display: "none" }}
                    />
                    <span>+</span> Upload Hero Image
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team Images Tab */}
        {activeTab === "team" && (
          <div className="section-homepageimg">
            <div className="section-header-homepageimg">
              <h2 className="section-title-homepageimg">Team Member Images</h2>
              <p style={{ marginTop: "0.5rem", color: "#666", fontSize: "0.9rem" }}>
                Upload images for team members. Text content is static and managed in the code.
              </p>
            </div>
            <div className="images-grid-homepageimg">
              {teamMembers.map((member) => {
                const teamImage = content?.teamImages?.find(
                  (img) => img.teamMemberIndex === member.index
                );
                return (
                  <div key={member.index} className="image-card-homepageimg">
                    {teamImage ? (
                      <>
                        <div className="image-wrapper-homepageimg">
                          <img src={teamImage.imageUrl} alt={member.name} />
                          <div className="image-overlay-homepageimg">
                            <label className="change-image-btn-homepageimg">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleTeamImageChange(member.index, e)}
                                disabled={loading || uploadingTeamIndex === member.index}
                                style={{ display: "none" }}
                              />
                              Change
                            </label>
                          </div>
                        </div>
                        <div style={{ padding: "1rem" }}>
                          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>{member.name}</h3>
                          <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>{member.position}</p>
                        </div>
                        <button
                          className="delete-image-btn-homepageimg"
                          onClick={() => handleDeleteTeamImage(teamImage._id, member.index)}
                          disabled={loading}
                          style={{ margin: "0.5rem" }}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="empty-state-homepageimg" style={{ padding: "2rem 1rem" }}>
                          <p style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>{member.name}</p>
                          <label className="upload-btn-homepageimg">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleTeamImageChange(member.index, e)}
                              disabled={loading || uploadingTeamIndex === member.index}
                              style={{ display: "none" }}
                            />
                            <span>+</span> Upload Image
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutContent;
