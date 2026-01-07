import React, { useState } from 'react';

const History = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  // Sample history data
  const historyItems = [
    {
      id: 1,
      type: 'link',
      value: 'https://bit.ly/scam123',
      status: 'danger',
      statusText: 'อันตราย',
      date: '07/01/2026 14:00',
    },
    {
      id: 2,
      type: 'phone',
      value: '091-234-5678',
      status: 'safe',
      statusText: 'ปลอดภัย',
      date: '07/01/2026 13:30',
    },
    {
      id: 3,
      type: 'bank',
      value: 'xxx-x-xxxxx-x (KBANK)',
      status: 'warning',
      statusText: 'มีรายงาน',
      date: '07/01/2026 12:00',
    },
    {
      id: 4,
      type: 'sms',
      value: 'คุณได้รับเงินคืนภาษี...',
      status: 'danger',
      statusText: 'Scam',
      date: '06/01/2026 18:00',
    },
    {
      id: 5,
      type: 'link',
      value: 'https://kbank.co.th',
      status: 'safe',
      statusText: 'ปลอดภัย',
      date: '06/01/2026 15:00',
    },
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'link':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        );
      case 'phone':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        );
      case 'bank':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
        );
      case 'sms':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'safe': return 'status-safe';
      case 'warning': return 'status-warning';
      case 'danger': return 'status-danger';
      default: return '';
    }
  };

  const filteredItems = historyItems.filter(item =>
    item.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedItems = expanded ? filteredItems : filteredItems.slice(0, 3);

  const openTypeFilterModal = () => {
    window.Swal?.fire({
      icon: 'info',
      title: 'ตัวกรองประเภท',
      text: 'ฟังก์ชันกำลังพัฒนา',
      confirmButtonColor: '#3ACE00',
    });
  };

  const openDateFilterModal = () => {
    window.Swal?.fire({
      icon: 'info',
      title: 'เรียงตามวันที่',
      text: 'ฟังก์ชันกำลังพัฒนา',
      confirmButtonColor: '#3ACE00',
    });
  };

  return (
    <section id="history-page">
      <div className="scanner-header">
        <h2>My History</h2>
      </div>

      <div className="history-controls">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="filter-btn" onClick={openTypeFilterModal}>
          <div className="active-dot"></div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </button>
        <button className="sort-btn" onClick={openDateFilterModal}>
          <div className="active-dot"></div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 3 21 3 21 8"></polyline>
            <line x1="4" y1="20" x2="21" y2="3"></line>
            <polyline points="21 16 21 21 16 21"></polyline>
            <line x1="15" y1="15" x2="21" y2="21"></line>
            <line x1="4" y1="4" x2="9" y2="9"></line>
          </svg>
        </button>
      </div>

      <div className="history-list">
        {displayedItems.map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-icon">
              {getTypeIcon(item.type)}
            </div>
            <div className="history-info">
              <p className="history-value">{item.value}</p>
              <span className="history-date">{item.date}</span>
            </div>
            <div className={`history-status ${getStatusClass(item.status)}`}>
              {item.statusText}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length > 3 && !expanded && (
        <div className="see-more-container">
          <button className="see-more-btn" onClick={() => setExpanded(true)}>
            ดูทั้งหมด
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default History;
