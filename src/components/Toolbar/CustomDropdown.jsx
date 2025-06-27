import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ label, options, onSelect, icon, value }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <button
        className={`custom-dropdown-trigger${open ? ' open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        {icon && <span className="dropdown-trigger-icon">{icon}</span>}
        <span>{label}</span>
        <span className="dropdown-arrow">▼</span>
      </button>
      {open && (
        <div className="custom-dropdown-menu">
          {options.map((opt, idx) => (
            <div
              key={opt.value || opt.label || idx}
              className="custom-dropdown-item"
              onClick={() => {
                setOpen(false);
                onSelect(opt.value);
              }}
            >
              {opt.icon && <span className="dropdown-item-icon">{opt.icon}</span>}
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown; 