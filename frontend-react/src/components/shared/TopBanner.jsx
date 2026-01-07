import React from 'react';

const TopBanner = ({ userProfile, onShare }) => {
  const handleLineOAClick = (e) => {
    e.preventDefault();
    if (window.Swal) {
      window.Swal.fire({
        title: 'เพิ่มเพื่อน LINE OA',
        text: 'คุณต้องการเพิ่มเพื่อน GunGong Official หรือไม่?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3ACE00',
        confirmButtonText: 'ไปหน้า LINE OA',
        cancelButtonText: 'ยกเลิก',
        background: '#fff',
        borderRadius: '20px',
      }).then((result) => {
        if (result.isConfirmed) {
          window.open('https://line.me/R/ti/p/@357asclq', '_blank');
        }
      });
    } else {
      window.open('https://line.me/R/ti/p/@357asclq', '_blank');
    }
  };

  return (
    <div className="top-banner">
      <img src="/img/mountain.png" alt="ภาพแบนเนอร์" />
      <div className="miniapp-gungong">MINIAPP Gun Gong</div>

      <div className="user-info">
        <div className="avatar-container">
          <img
            className="avatar"
            src={userProfile?.pictureUrl || '/img/profile.png'}
            alt="avatar"
          />
        </div>
        <div className="text-group">
          <div className="user-name">{userProfile?.displayName || '(Username)'}</div>
          <div className="username-id">User ID: {userProfile?.userId?.slice(0, 10) || '...'}</div>
        </div>
      </div>

      <div className="header-actions">
        <button className="action-btn" onClick={onShare}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
        </button>

        <a href="#" onClick={handleLineOAClick} className="action-btn line-oa-header-btn">
          <img src="/img/logo.png" alt="LINE" />
        </a>
      </div>
    </div>
  );
};

export default TopBanner;
