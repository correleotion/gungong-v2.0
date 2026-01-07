import React, { useState, useRef } from 'react';

const Verify = ({ userProfile, onNavigate }) => {
  const [currentLevel, setCurrentLevel] = useState('silver');
  const cardSliderRef = useRef(null);
  const menuSliderRef = useRef(null);

  const levels = ['silver', 'gold', 'diamond'];
  const levelIndex = levels.indexOf(currentLevel);

  const switchCard = (level) => {
    setCurrentLevel(level);
    const index = levels.indexOf(level);
    if (cardSliderRef.current) {
      const width = cardSliderRef.current.offsetWidth;
      cardSliderRef.current.scrollTo({ left: index * width, behavior: 'smooth' });
    }
    if (menuSliderRef.current) {
      const width = menuSliderRef.current.offsetWidth;
      menuSliderRef.current.scrollTo({ left: index * width, behavior: 'smooth' });
    }
  };

  const handleCardScroll = () => {
    if (cardSliderRef.current) {
      const scrollLeft = cardSliderRef.current.scrollLeft;
      const width = cardSliderRef.current.offsetWidth;
      const activeIndex = Math.round(scrollLeft / width);
      if (levels[activeIndex] !== currentLevel) {
        setCurrentLevel(levels[activeIndex]);
        if (menuSliderRef.current) {
          menuSliderRef.current.scrollTo({ left: activeIndex * width, behavior: 'smooth' });
        }
      }
    }
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

  const CardContent = ({ level, shieldImg }) => (
    <div className={`verification-card level-${level}`}>
      <img src={`/img/${level}_card.png`} className="card-bg" alt={`${level} Card`} />
      <div className="card-content">
        <div className="card-col-left">
          <div className="card-header-row">
            <div className="shield-circle">
              <img src={shieldImg} alt={`${level} Shield`} />
            </div>
            <div className="level-info-box">
              <span className="level-label">ระดับการยืนยัน</span>
              <h3 className="level-title current-level-text">{level.toUpperCase()}</h3>
            </div>
          </div>
          <div className="user-info-box">
            <h2 className="card-user-name user-name-text">
              {userProfile?.displayName || '(Username)'}
            </h2>
            <p className="card-user-id user-id-text">
              User ID: {userProfile?.userId?.slice(0, 10) || '...'}
            </p>
          </div>
        </div>
        <div className="card-col-right">
          <div className="profile-circle-box">
            <img
              src={userProfile?.pictureUrl || '/img/profile.png'}
              className="card-avatar user-avatar-img"
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

  const MenuContent = ({ level, items, description }) => (
    <div className="verify-slide-item menu-slide">
      <div className="slide-content-wrapper">
        <div className="identification-header">
          <h2>การยืนยันตัวตน</h2>
        </div>
        <div className="identification-desc">
          <p>{description}</p>
        </div>
        <div className="verify-menu-list">
          {items.map((item, index) => (
            <div key={index} className="verify-menu-card" onClick={() => openFeature(item.feature)}>
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
          <div className="share-card-container" style={{ marginTop: '20px' }}>
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

  return (
    <section id="verification-page">
      {/* Level Selector */}
      <div className="level-selector-container">
        <div className="badge-group">
          {levels.map((level) => (
            <span
              key={level}
              className={`badge-level ${currentLevel === level ? 'active' : ''}`}
              onClick={() => switchCard(level)}
            >
              {level.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Card Slider */}
      <div className="verification-card-container">
        <div
          className="verify-slider"
          ref={cardSliderRef}
          onScroll={handleCardScroll}
        >
          <div className="verify-slide-item">
            <CardContent level="silver" shieldImg="/img/silver shield.png" />
          </div>
          <div className="verify-slide-item">
            <CardContent level="gold" shieldImg="/img/gold shield.png" />
          </div>
          <div className="verify-slide-item">
            <CardContent level="diamond" shieldImg="/img/dimond shield.png" />
          </div>
        </div>
      </div>

      {/* Menu Slider */}
      <div className="verify-slider" ref={menuSliderRef}>
        <MenuContent
          level="silver"
          items={silverMenuItems}
          description="เพื่อยกระดับความน่าเชื่อถือให้กับบัญชีของคุณ"
        />
        <MenuContent
          level="gold"
          items={goldMenuItems}
          description="เพื่อยกระดับความน่าเชื่อถือให้กับโปรไฟล์ของคุณ"
        />
        <MenuContent
          level="diamond"
          items={diamondMenuItems}
          description="เพื่อยกระดับความน่าเชื่อถือให้กับองค์กรของคุณ"
        />
      </div>
    </section>
  );
};

export default Verify;
