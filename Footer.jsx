import React from 'react';
import { ShieldAlert } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="brand-icon-wrapper-small">
            <ShieldAlert size={18} />
          </div>
          <span className="brand-text">Traffic<span className="brand-highlight">Watch</span></span>
        </div>
        <p className="footer-text">
          &copy; {new Date().getFullYear()} TrafficWatch System. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
