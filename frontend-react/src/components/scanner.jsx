import React, { useState, useEffect, useRef } from 'react';
import { banks } from '../utils/script';

const Scanner = ({ onNavigate }) => {
  const [currentSubPage, setCurrentSubPage] = useState(null);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const bankDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(event.target)) {
        setIsBankDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const goBack = () => {
    setCurrentSubPage(null);
  };

  const openFeature = (feature) => {
    setCurrentSubPage(feature);
  };

  const clearInput = (inputId) => {
    const input = document.getElementById(inputId);
    if (input) input.value = '';
  };

  const checkLink = async () => {
    const input = document.getElementById('link-input');
    const url = input?.value?.trim();
    if (!url) {
      window.Swal?.fire({ icon: 'warning', title: 'กรุณาใส่ลิงก์', confirmButtonColor: '#3ACE00' });
      return;
    }
    window.Swal?.fire({ icon: 'info', title: 'กำลังตรวจสอบ...', text: url, confirmButtonColor: '#3ACE00' });
  };

  const checkSMS = async () => {
    const input = document.getElementById('sms-input');
    const text = input?.value?.trim();
    if (!text) {
      window.Swal?.fire({ icon: 'warning', title: 'กรุณาใส่ข้อความ', confirmButtonColor: '#3ACE00' });
      return;
    }
    window.Swal?.fire({ icon: 'info', title: 'กำลังวิเคราะห์...', text: text, confirmButtonColor: '#3ACE00' });
  };

  const scanCode = () => {
    window.Swal?.fire({
      icon: 'info',
      title: 'สแกน QR Code',
      text: 'ฟังก์ชันนี้ต้องใช้ LIFF SDK กรุณาเปิดผ่าน LINE App',
      confirmButtonColor: '#3ACE00'
    });
  };

  const checkBank = async () => {
    const bankCode = document.getElementById('selected-bank-code')?.value;
    const accountNumber = document.getElementById('bank-input')?.value?.trim();
    if (!accountNumber) {
      window.Swal?.fire({ icon: 'warning', title: 'กรุณาใส่เลขบัญชี', confirmButtonColor: '#3ACE00' });
      return;
    }
    window.Swal?.fire({ icon: 'info', title: 'กำลังตรวจสอบ...', text: accountNumber, confirmButtonColor: '#3ACE00' });
  };

  const checkPhone = async () => {
    const input = document.getElementById('phone-input');
    const phone = input?.value?.trim();
    if (!phone) {
      window.Swal?.fire({ icon: 'warning', title: 'กรุณาใส่เบอร์โทร', confirmButtonColor: '#3ACE00' });
      return;
    }
    window.Swal?.fire({ icon: 'info', title: 'กำลังตรวจสอบ...', text: phone, confirmButtonColor: '#3ACE00' });
  };

  const scannerMenuItems = [
    {
      id: 'check-link',
      title: 'ตรวจสอบลิงก์',
      subtitle: 'ตรวจสอบ / URL Domain',
      iconClass: 'icon-link',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      ),
    },
    {
      id: 'check-sms',
      title: 'ตรวจสอบข้อความ',
      subtitle: 'วิเคราะห์ Text Scam',
      iconClass: 'icon-text',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      ),
    },
    {
      id: 'scan-qr',
      title: 'สแกน QR Code',
      subtitle: 'เช็ค Payment QR',
      iconClass: 'icon-qrcode',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
      ),
    },
    {
      id: 'check-bank',
      title: 'ตรวจสอบเลขบัญชี',
      subtitle: 'ค้นหา Blacklist',
      iconClass: 'icon-bank',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      ),
    },
    {
      id: 'check-phone',
      title: 'ตรวจสอบเบอร์โทร',
      subtitle: 'ค้นหา Call Center',
      iconClass: 'icon-call',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      ),
    },
  ];

  // Sub-pages
  if (currentSubPage === 'check-link') {
    return (
      <section id="check-link-page">
        <div className="scanner-header">
          <button className="back-btn" onClick={goBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h2>เช็คลิงค์</h2>
        </div>
        <div className="check-link-container">
          <div className="input-section">
            <label className="input-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              ใส่ลิงก์ที่ต้องการเช็ค
            </label>
            <div className="input-group">
              <input type="text" id="link-input" placeholder="https://bit.ly/xx" />
              <button className="clear-btn" onClick={() => clearInput('link-input')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <button className="check-btn" onClick={checkLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              ตรวจสอบเลย
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (currentSubPage === 'check-sms') {
    return (
      <section id="check-sms-page">
        <div className="scanner-header">
          <button className="back-btn" onClick={goBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h2>เช็คข้อความ</h2>
        </div>
        <div className="check-link-container">
          <div className="input-section">
            <label className="input-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              ใส่ข้อความที่ต้องการเช็ค
            </label>
            <div className="input-group">
              <input type="text" id="sms-input" placeholder="พิมพ์ข้อความ..." />
              <button className="clear-btn" onClick={() => clearInput('sms-input')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <button className="check-btn" onClick={checkSMS}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              ตรวจสอบเลย
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (currentSubPage === 'scan-qr') {
    return (
      <section id="scan-qr-page">
        <div className="scanner-header">
          <button className="back-btn" onClick={goBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h2>สแกน QR Code</h2>
        </div>
        <div className="check-link-container">
          <div className="input-section" style={{ textAlign: 'center' }}>
            <div style={{
              margin: '20px auto',
              width: '80px',
              height: '80px',
              background: '#ecfdf5',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#3ACE00" strokeWidth="2" style={{ width: '40px', height: '40px' }}>
                <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                <rect x="7" y="7" width="10" height="10" rx="1"></rect>
              </svg>
            </div>
            <button className="check-btn" onClick={scanCode}>
              เริ่มสแกน QR Code
            </button>
            <div id="qr-result-container" style={{ display: 'none' }}>
              <p id="qr-result"></p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (currentSubPage === 'check-bank') {
    return (
      <section id="check-bank-page">
        <div className="scanner-header">
          <button className="back-btn" onClick={goBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h2>เช็คเลขบัญชี</h2>
        </div>
        <div className="check-link-container">
          <div className="input-section">
            <label className="input-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="22" x2="21" y2="22"></line>
                <line x1="6" y1="18" x2="6" y2="11"></line>
                <line x1="10" y1="18" x2="10" y2="11"></line>
                <line x1="14" y1="18" x2="14" y2="11"></line>
                <line x1="18" y1="18" x2="18" y2="11"></line>
                <polygon points="12 2 2 7 22 7 12 2"></polygon>
              </svg>
              เลือกธนาคาร
            </label>

            {/* Custom Bank Dropdown with Images */}
            <div
              className={`bank-select-wrapper ${isBankDropdownOpen ? 'active' : ''}`}
              ref={bankDropdownRef}
            >
              <div
                className="selected-bank-box"
                onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
              >
                <div className="bank-info">
                  {selectedBank ? (
                    <>
                      <img
                        src={`/img/banks/${selectedBank.code}.png`}
                        alt={selectedBank.name}
                        className="bank-logo"
                      />
                      <span>{selectedBank.name}</span>
                    </>
                  ) : (
                    <span className="placeholder-text">เลือกธนาคาร</span>
                  )}
                </div>
                <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              <div className="bank-options-list">
                {banks.map((bank) => (
                  <div
                    key={bank.code}
                    className="bank-option-item"
                    onClick={() => {
                      setSelectedBank(bank);
                      setIsBankDropdownOpen(false);
                    }}
                  >
                    <img
                      src={`/img/banks/${bank.code}.png`}
                      alt={bank.name}
                      className="bank-logo"
                    />
                    <span>{bank.name}</span>
                  </div>
                ))}
              </div>

              <input type="hidden" id="selected-bank-code" value={selectedBank?.code || ''} />
            </div>

            <label className="input-label" style={{ marginTop: '20px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
              ระบุเลขบัญชี
            </label>
            <div className="input-group">
              <input type="number" id="bank-input" placeholder="เลขบัญชี 10-12 หลัก" />
              <button className="clear-btn" onClick={() => clearInput('bank-input')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <button className="check-btn" onClick={checkBank}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              ตรวจสอบบัญชี
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (currentSubPage === 'check-phone') {
    return (
      <section id="check-phone-page">
        <div className="scanner-header">
          <button className="back-btn" onClick={goBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h2>เช็คเบอร์โทร</h2>
        </div>
        <div className="check-link-container">
          <div className="input-section">
            <label className="input-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              ระบุเบอร์โทรศัพท์
            </label>
            <div className="input-group">
              <input type="tel" id="phone-input" placeholder="09x-xxx-xxxx" />
              <button className="clear-btn" onClick={() => clearInput('phone-input')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <button className="check-btn" onClick={checkPhone}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              ตรวจสอบเบอร์โทร
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Main Scanner Page
  return (
    <section id="scanner-page">
      <div className="scanner-header">
        <h2>My Scanner</h2>
      </div>

      <div className="scanner-menu-list">
        {scannerMenuItems.map((item) => (
          <div key={item.id} className="scanner-card" onClick={() => openFeature(item.id)}>
            <div className={`card-icon ${item.iconClass}`}>
              {item.icon}
            </div>
            <div className="card-text">
              <h4>{item.title}</h4>
              <p>{item.subtitle}</p>
            </div>
            <div className="card-action">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Scanner;
