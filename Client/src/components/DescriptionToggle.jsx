import React, { useState } from 'react';
import '../CSS/components/DescriptionToggle.css';

const DescriptionToggle = ({ shortText, fullText, charLimit = 140 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPreviewText = () => {
    if (shortText && shortText.trim().length > 0) return shortText;
    if (!fullText) return '';
    if (fullText.length <= charLimit) return fullText;
    return `${fullText.slice(0, charLimit).trim()}...`;
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  if (!fullText) return null;

  return (
    <div className="description-container">
      {!isOpen && (
        <>
          <p className="description-short">{getPreviewText()}</p>
          <button type="button" className="toggle-btn" onClick={handleToggle}>
            Details
          </button>
        </>
      )}

      {isOpen && (
        <div className={`description-full ${isOpen ? 'dropdown-open' : ''}`}>
          <p>{fullText}</p>
          <button type="button" className="toggle-btn" onClick={handleToggle}>
            Less
          </button>
        </div>
      )}
    </div>
  );
};

export default DescriptionToggle;

