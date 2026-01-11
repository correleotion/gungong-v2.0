import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const TopBanner = ({ userProfile, onShare, isDarkMode, onToggleDarkMode }) => {
  const { user, signInWithGoogle, signOut, isAuthenticated, loading } = useAuth();
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
      <div className="miniapp-gungong">Gun Gong</div>

      <div className="user-info">
        <div className="avatar-container">
          {/* ใช้รูปจาก Firebase (Google) ก่อน, ถ้าไม่มีใช้จาก LIFF, ถ้าไม่มีใช้ SVG */}
          {(user?.photoURL || userProfile?.pictureUrl) ? (
            <img
              className="avatar"
              src={user?.photoURL || userProfile?.pictureUrl}
              alt="avatar"
            />
          ) : (
            <div className="avatar-svg">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          )}
        </div>
        <div className="text-group">
          {/* ใช้ชื่อจาก Firebase ก่อน, ถ้าไม่มีใช้จาก LIFF */}
          <div className="user-name">{user?.displayName || userProfile?.displayName || '(Username)'}</div>
          <div className="username-id">
            {user?.email ? user.email : `User ID: ${userProfile?.userId?.slice(0, 10) || '...'}`}
          </div>
        </div>
      </div>

      <div className="header-actions">
        {/* Google Login / User Avatar */}
        {isAuthenticated && user ? (
          <div className="header-user-menu">
            <img
              src={user.photoURL || '/img/profile.png'}
              alt={user.displayName}
              className="header-user-avatar"
              onClick={signOut}
              title="คลิกเพื่อออกจากระบบ"
            />
          </div>
        ) : (
          <button
            className="action-btn google-login-header-btn"
            onClick={signInWithGoogle}
            disabled={loading}
            title="เข้าสู่ระบบด้วย Google"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>
        )}

        {/* Dark Mode Toggle */}
        <div className="theme-toggle" onClick={onToggleDarkMode}>
          <div className={`toggle-track ${isDarkMode ? 'dark' : 'light'}`}>
            <div className="toggle-icons">
              <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </div>
            <div className="toggle-thumb"></div>
          </div>
        </div>

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
