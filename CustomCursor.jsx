import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    const moveCursor = (e) => {
      // The cursor itself tracks exactly on the mouse coordinates
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0,
      });
    };

    const handleHover = () => {
      gsap.to(cursor, { scale: 0.8, duration: 0.3 });
    };

    const handleHoverOut = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
    };

    window.addEventListener('mousemove', moveCursor);

    // Add hover listeners to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleHoverOut);
    });

    // Setup mutation observer to handle dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          const newInteractiveElements = document.querySelectorAll('a:not([data-cursor-attached]), button:not([data-cursor-attached]), input:not([data-cursor-attached]), select:not([data-cursor-attached]), textarea:not([data-cursor-attached])');
          newInteractiveElements.forEach(el => {
            el.setAttribute('data-cursor-attached', 'true');
            el.addEventListener('mouseenter', handleHover);
            el.addEventListener('mouseleave', handleHoverOut);
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('mouseleave', handleHoverOut);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor">
        <svg viewBox="0 0 24 24" fill="var(--accent-primary)" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 2L20 12L12 14L9 22L4 2Z" stroke="#000" strokeWidth="1" strokeLinejoin="round"/>
        </svg>
      </div>
    </>
  );
};

export default CustomCursor;
