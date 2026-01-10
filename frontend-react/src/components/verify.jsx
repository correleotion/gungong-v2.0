import React, { useState, useRef, useCallback } from 'react';

const Verify = ({ userProfile, onNavigate }) => {
  const [currentLevel, setCurrentLevel] = useState('silver');
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const levels = ['silver', 'gold', 'diamond'];

  // Get card position based on current level
  const getCardPosition = (cardLevel) => {
    const currentIndex = levels.indexOf(currentLevel);
    const cardIndex = levels.indexOf(cardLevel);
    const diff = cardIndex - currentIndex;

    // Normalize for circular carousel
    if (diff === 0) return 'center';
    if (diff === 1 || diff === -2) return 'right';
    if (diff === -1 || diff === 2) return 'left';
    return 'center';
  };

  // Switch card handler
  const switchCard = (level) => {
    setCurrentLevel(level);
  };

  // Navigate to next/previous card
  const navigateCarousel = useCallback((direction) => {
    const currentIndex = levels.indexOf(currentLevel);
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % levels.length;
    } else {
      newIndex = (currentIndex - 1 + levels.length) % levels.length;
    }
    setCurrentLevel(levels[newIndex]);
  }, [currentLevel, levels]);

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        navigateCarousel('next');
      } else {
        navigateCarousel('prev');
      }
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const openFeature = (feature) => {
    onNavigate(feature);
  };

  const shareVerificationCard = () => {
    if (window.Swal) {
      window.Swal.fire({
        icon: 'info',
        title: 'แชร์บัตรประจำตัว',
        text: 'ฟังก์ชันนี้ต้องใช้ LIFF SDK กรุณาเปิดผ่าน LINE App',
        confirmButtonColor: '#3ACE00',
      });
    }
  };

  // 3D Carousel Card Component
  const CarouselCard = ({ level, shieldImg }) => {
    const position = getCardPosition(level);

    return (
      <div className={`carousel-card card-${level} card-${position}`}>
        <img src={`/img/${level}_card.png`} className="card-bg" alt={`${level} Card`} />
        <div className="card-content">
          <div className="card-col-left">
            <div className="card-header-row">
              <div className="shield-circle">
                <img src={shieldImg} alt={`${level} Shield`} />
              </div>
              <div className="level-info-box">
                <span className="level-label">ระดับการยืนยัน</span>
                <h3 className="level-title">{level.toUpperCase()}</h3>
              </div>
            </div>
            <div className="user-info-box">
              <h2 className="card-user-name">
                {userProfile?.displayName || '(Username)'}
              </h2>
              <p className="card-user-id">
                User ID: {userProfile?.userId?.slice(0, 10) || '...'}
              </p>
            </div>
          </div>
          <div className="card-col-right">
            <div className="profile-circle-box">
              <img
                src={userProfile?.pictureUrl || '/img/profile.png'}
                className="card-avatar"
                alt="Profile"
              />
              <div className="mini-logo-badge">
                <img src="/img/logo.png" alt="Logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MenuContent = ({ items, description }) => (
    <div className="verify-menu-section">
      <div className="identification-header">
        <h2>การยืนยันตัวตน</h2>
      </div>
      <div className="identification-desc">
        <p>{description}</p>
      </div>
      <div className="verify-menu-list">
        {items.map((item, index) => (
          <div
            key={index}
            className="verify-menu-card animate-card"
            onClick={() => openFeature(item.feature)}
            style={{ animationDelay: `${0.05 + index * 0.1}s` }}
          >
            <div className={`verify-card-icon icon-${item.iconClass}`}>
              {item.icon}
            </div>
            <div className="verify-card-text">
              <h4>{item.title}</h4>
              <p>{item.subtitle}</p>
            </div>
            <div className="verify-card-action">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        ))}
        <div className="share-card-container">
          <button className="share-card-btn" onClick={shareVerificationCard}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            แชร์บัตรประจำตัว
          </button>
        </div>
      </div>
    </div>
  );

  const silverMenuItems = [
    {
      feature: 'verify-phone',
      iconClass: 'verify-phone',
      title: 'เบอร์โทร',
      subtitle: 'ผูกเบอร์โทรศัพท์',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      ),
    },
    {
      feature: 'verify-bank',
      iconClass: 'verify-bank',
      title: 'บัญชีธนาคาร',
      subtitle: 'ผูกบัญชีธนาคาร',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      ),
    },
  ];

  const goldMenuItems = [
    {
      feature: 'verify-id-card',
      iconClass: 'verify-id-card',
      title: 'เลขบัตรประชาชน',
      subtitle: 'ยืนยันตัวตนด้วยบัตรประชาชน',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
          <line x1="7" y1="8" x2="7" y2="8"></line>
          <line x1="7" y1="12" x2="7" y2="12"></line>
          <line x1="7" y1="16" x2="7" y2="16"></line>
        </svg>
      ),
    },
    {
      feature: 'verify-face',
      iconClass: 'verify-face',
      title: 'สแกนใบหน้า',
      subtitle: 'ยืนยันตัวตนด้วยใบหน้า',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
    },
  ];

  const diamondMenuItems = [
    {
      feature: 'verify-business',
      iconClass: 'verify-business',
      title: 'เลขทะเบียนการค้า',
      subtitle: 'ยืนยันสำหรับนิติบุคคล',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
        </svg>
      ),
    },
  ];

  // Get current menu items based on level
  const getCurrentMenuItems = () => {
    switch (currentLevel) {
      case 'gold': return { items: goldMenuItems, desc: 'เพื่อยกระดับความน่าเชื่อถือให้กับโปรไฟล์ของคุณ' };
      case 'diamond': return { items: diamondMenuItems, desc: 'เพื่อยกระดับความน่าเชื่อถือให้กับองค์กรของคุณ' };
      default: return { items: silverMenuItems, desc: 'เพื่อยกระดับความน่าเชื่อถือให้กับบัญชีของคุณ' };
    }
  };

  const currentMenu = getCurrentMenuItems();

  return (
    <section id="verification-page">
      <div className="section-content">
        {/* Level Selector Tabs */}
        <div className="level-selector-container">
          <div className="badge-group">
            {levels.map((level) => (
              <span
                key={level}
                className={`badge-level badge-${level} ${currentLevel === level ? 'active' : ''}`}
                onClick={() => switchCard(level)}
              >
                {level.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* 3D Carousel Container */}
        <div
          className="carousel-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="carousel-track">
            <CarouselCard level="silver" shieldImg="/img/silver shield.png" />
            <CarouselCard level="gold" shieldImg="/img/gold shield.png" />
            <CarouselCard level="diamond" shieldImg="/img/dimond shield.png" />
          </div>
        </div>

        {/* Menu Section */}
        <MenuContent items={currentMenu.items} description={currentMenu.desc} />
      </div>
    </section>
  );
};

export default React.memo(Verify);
