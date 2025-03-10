import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const DraggableBackButton = ({ onBackClick }) => {
  const [position, setPosition] = useState({ x: 20, y: 80 }); // default position
  const [isDragging, setIsDragging] = useState(false);
  const [wasDragging, setWasDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  // Load saved position from localStorage on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem('backButtonPosition');
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition));
      } catch (e) {
        console.error('Error parsing saved position', e);
      }
    }
  }, []);

  // Save position to localStorage when it changes
  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem('backButtonPosition', JSON.stringify(position));
    }
  }, [position, isDragging]);

  // Prevent button from going off-screen
  useEffect(() => {
    const checkBoundaries = () => {
      if (!buttonRef.current) return;
      
      const button = buttonRef.current;
      const buttonRect = button.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newX = position.x;
      let newY = position.y;
      
      // Check horizontal boundaries
      if (newX < 0) newX = 0;
      if (newX + buttonRect.width > viewportWidth) {
        newX = viewportWidth - buttonRect.width;
      }
      
      // Check vertical boundaries
      if (newY < 0) newY = 0;
      if (newY + buttonRect.height > viewportHeight) {
        newY = viewportHeight - buttonRect.height;
      }
      
      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
      }
    };
    
    checkBoundaries();
    window.addEventListener('resize', checkBoundaries);
    
    return () => {
      window.removeEventListener('resize', checkBoundaries);
    };
  }, [position]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setWasDragging(false);
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - buttonRect.left,
      y: e.clientY - buttonRect.top
    });
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setWasDragging(false);
    
    const touch = e.touches[0];
    const buttonRect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - buttonRect.left,
      y: touch.clientY - buttonRect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    // Set wasDragging to true as soon as actual movement happens
    setWasDragging(true);
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    // Set wasDragging to true as soon as actual movement happens
    setWasDragging(true);
    
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragOffset.x,
      y: touch.clientY - dragOffset.y
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // wasDragging state is maintained to be checked on click
  };

  const handleClick = (e) => {
    // If the button was dragged, prevent the click event
    if (wasDragging) {
      e.preventDefault();
      e.stopPropagation();
      
      // Reset wasDragging after a short delay
      setTimeout(() => {
        setWasDragging(false);
      }, 100);
      
      return;
    }
    
    // Otherwise, trigger the back action
    onBackClick();
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  return (
    <button 
      ref={buttonRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={`fixed px-4 py-2 bg-[#317873] text-white rounded hover:bg-[#228B22] transition-colors shadow-md z-50 cursor-${isDragging ? 'grabbing' : 'grab'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none'
      }}
      aria-label="Back to products"
    >
      <FaArrowLeft />
    </button>
  );
};

export default DraggableBackButton;