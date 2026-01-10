import React, { useState, useEffect, useRef } from 'react';
import { banks } from '../utils/script';

const Scanner = ({ onNavigate }) => {
  const [currentSubPage, setCurrentSubPage] = useState(null);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [contentTab, setContentTab] = useState('link'); // 'link' or 'sms'
  const [personalTab, setPersonalTab] = useState('bank'); // 'bank' or 'phone'
  const bankDropdownRef = useRef(null);

  // --- Point A Refactor: State สำหรับจัดการ Input ทั้งหมด ---
  const [inputs, setInputs] = useState({
    link: '',
    sms: '',
    bank: '',
    phone: ''
  });

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const clearInput = (field) => {
    setInputs(prev => ({ ...prev, [field]: '' }));
  };
  // -----------------------------------------------------

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

  const checkLink = async () => {
    const url = inputs.link.trim();
    if (!url) {
      window.Swal?.fire({ icon: 'warning', title: 'กรุณาใส่ลิงก์', confirmButtonColor: '#3ACE00' });
      return;
    }
    window.Swal?.fire({ icon: 'info', title: 'กำลังตรวจสอบ...', text: url, confirmButtonColor: '#3ACE00' });
  };

  const checkSMS = async () => {
    const text = inputs.sms.trim();
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
    const accountNumber = inputs.bank.trim();
    if (!selectedBank) {
      window.Swal?.fire({ icon: 'warning', title: 'กรุณาเลือกธนาคาร', confirmButtonColor: '#3ACE00' });
      return;
    }
    if (!accountNumber) {
      window.Swal?.fire({ icon: 'warning', title: 'กรุณาใส่เลขบัญชี', confirmButtonColor: '#3ACE00' });
      return;
    }
    window.Swal?.fire({
      icon: 'info',
      title: 'กำลังตรวจสอบ...',
      text: `ธนาคาร: ${selectedBank.name}\nเลขบัญชี: ${accountNumber}`,
      confirmButtonColor: '#3ACE00'
    });
  };

  const checkPhone = async () => {
    const phone = inputs.phone.trim();
    if (!phone) {
      window.Swal?.fire({ icon: 'warning', title: 'กรุณาใส่เบอร์โทร', confirmButtonColor: '#3ACE00' });
      return;
    }
    window.Swal?.fire({ icon: 'info', title: 'กำลังตรวจสอบ...', text: phone, confirmButtonColor: '#3ACE00' });
  };

  // Reusable Bank Dropdown Component เพื่อลดความซ้ำซ้อน
  const BankDropdown = () => (
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
              <img src={`/img/banks/${selectedBank.code}.png`} alt={selectedBank.name} className="bank-logo" />
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
            <img src={`/img/banks/${bank.code}.png`} alt={bank.name} className="bank-logo" />
            <span>{bank.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Sub-pages Logic
  if (currentSubPage === 'check-content') {
    return (
      <section id="check-content-page">
        <div className="scanner-header">
          <button className="back-btn" onClick={goBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h2>ตรวจสอบเนื้อหา</h2>
        </div>

        <div className="scanner-tabs">
          <button className={`scanner-tab ${contentTab === 'link' ? 'active' : ''}`} onClick={() => setContentTab('link')}>ลิงก์</button>
          <button className={`scanner-tab ${contentTab === 'sms' ? 'active' : ''}`} onClick={() => setContentTab('sms')}>ข้อความ</button>
        </div>

        <div className="check-link-container">
          {contentTab === 'link' ? (
            <div className="input-section">
              <label className="input-label">ใส่ลิงก์ที่ต้องการเช็ค</label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="https://bit.ly/xx"
                  value={inputs.link}
                  onChange={(e) => handleInputChange('link', e.target.value)}
                />
                <button className="clear-btn" onClick={() => clearInput('link')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <button className="check-btn" onClick={checkLink}>ตรวจสอบลิงก์</button>
            </div>
          ) : (
            <div className="input-section">
              <label className="input-label">ใส่ข้อความที่ต้องการเช็ค</label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="พิมพ์ข้อความ..."
                  value={inputs.sms}
                  onChange={(e) => handleInputChange('sms', e.target.value)}
                />
                <button className="clear-btn" onClick={() => clearInput('sms')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <button className="check-btn" onClick={checkSMS}>ตรวจสอบข้อความ</button>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (currentSubPage === 'scan-qr') {
    return (
      <section id="scan-qr-page">
        <div className="scanner-header">
          <button className="back-btn" onClick={goBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h2>สแกน QR Code</h2>
        </div>
        <div className="check-link-container">
          <div className="input-section" style={{ textAlign: 'center' }}>
            <button className="check-btn" onClick={scanCode}>เริ่มสแกน QR Code</button>
          </div>
        </div>
      </section>
    );
  }

  if (currentSubPage === 'check-personal') {
    return (
      <section id="check-personal-page">
        <div className="scanner-header">
          <button className="back-btn" onClick={goBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h2>ตรวจสอบข้อมูลส่วนตัว</h2>
        </div>

        <div className="scanner-tabs">
          <button className={`scanner-tab ${personalTab === 'bank' ? 'active' : ''}`} onClick={() => setPersonalTab('bank')}>บัญชี</button>
          <button className={`scanner-tab ${personalTab === 'phone' ? 'active' : ''}`} onClick={() => setPersonalTab('phone')}>เบอร์โทร</button>
        </div>

        <div className="check-link-container">
          {personalTab === 'bank' ? (
            <div className="input-section">
              <label className="input-label">เลือกธนาคาร</label>
              <BankDropdown />
              <label className="input-label" style={{ marginTop: '20px' }}>ระบุเลขบัญชี</label>
              <div className="input-group">
                <input
                  type="number"
                  placeholder="เลขบัญชี 10-12 หลัก"
                  value={inputs.bank}
                  onChange={(e) => handleInputChange('bank', e.target.value)}
                />
                <button className="clear-btn" onClick={() => clearInput('bank')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <button className="check-btn" onClick={checkBank}>ตรวจสอบบัญชี</button>
            </div>
          ) : (
            <div className="input-section">
              <label className="input-label">ระบุเบอร์โทรศัพท์</label>
              <div className="input-group">
                <input
                  type="tel"
                  placeholder="09x-xxx-xxxx"
                  value={inputs.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
                <button className="clear-btn" onClick={() => clearInput('phone')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <button className="check-btn" onClick={checkPhone}>ตรวจสอบเบอร์โทร</button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Main Menu
  return (
    <section id="scanner-page">
      <div className="section-content">
        <div className="scanner-header"><h2>My Scanner</h2></div>
        <div className="scanner-menu-list">
          <div className="scanner-group animate-card" style={{ animationDelay: '0.05s' }}>
            <div className="scanner-group-label"><span>ตรวจสอบเนื้อหา</span></div>
            <div className="scanner-card" onClick={() => openFeature('check-content')}>
              <div className="card-icon icon-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></div>
              <div className="card-text"><h4>ตรวจสอบลิงก์ / ข้อความ</h4><p>URL, Domain และ Text Scam</p></div>
              <div className="card-action"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
          </div>

          <div className="scanner-group animate-card" style={{ animationDelay: '0.15s' }}>
            <div className="scanner-group-label"><span>ตรวจสอบข้อมูลส่วนตัว</span></div>
            <div className="scanner-card" onClick={() => openFeature('check-personal')}>
              <div className="card-icon icon-bank"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg></div>
              <div className="card-text"><h4>ตรวจสอบบัญชี / เบอร์โทร</h4><p>ค้นหา Blacklist และ Call Center</p></div>
              <div className="card-action"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
          </div>

          <div className="scanner-group animate-card" style={{ animationDelay: '0.25s' }}>
            <div className="scanner-group-label"><span>สแกน</span></div>
            <div className="scanner-card" onClick={() => openFeature('scan-qr')}>
              <div className="card-icon icon-qrcode"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg></div>
              <div className="card-text"><h4>สแกน QR Code</h4><p>เช็ค Payment QR</p></div>
              <div className="card-action"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Scanner;