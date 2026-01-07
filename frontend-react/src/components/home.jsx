import React, { useState, useRef, useEffect } from 'react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);
  const slides = ['/img/banner2.png', '/img/banner1.png'];

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % slides.length;
        scrollToSlide(next);
        return next;
      });
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const scrollToSlide = (index) => {
    if (sliderRef.current) {
      const width = sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth',
      });
    }
  };

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    scrollToSlide(index);
    stopAutoPlay();
    startAutoPlay();
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const width = sliderRef.current.offsetWidth;
      const activeIndex = Math.round(scrollLeft / width);
      setCurrentSlide(activeIndex);
    }
  };

  return (
    <section id="home-page" className="active">
      {/* Banner Slider */}
      <div className="banner">
        <div
          className="banner-slider"
          ref={sliderRef}
          onScroll={handleScroll}
          onTouchStart={stopAutoPlay}
          onTouchEnd={startAutoPlay}
          onMouseEnter={stopAutoPlay}
          onMouseLeave={startAutoPlay}
        >
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide}
              className="banner-slide"
              alt={`Banner ${index + 1}`}
            />
          ))}
        </div>
        <div className="banner-pagination">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => handleSlideChange(index)}
            />
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-icon-bg">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <div className="status-info">
          <h3>Status</h3>
          <p>เครื่องของคุณปลอดภัยดี</p>
        </div>
        <div className="status-action">
          <span>ดูรายละเอียด</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>

      {/* Summary Card */}
      <div className="summary-card">
        <div className="summary-header">
          <div className="summary-title">
            <h3>Summary</h3>
            <span>of this week</span>
          </div>
          <div className="summary-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </div>
        </div>

        <div className="summary-stats-row">
          <div className="summary-item green-1">
            <span className="label">check</span>
            <span className="value">43</span>
          </div>
          <div className="summary-item green-2">
            <span className="label">block</span>
            <span className="value">36</span>
          </div>
          <div className="summary-item green-3">
            <span className="label">scam</span>
            <span className="value">12</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
