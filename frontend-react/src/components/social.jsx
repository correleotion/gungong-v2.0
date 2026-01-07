import React, { useState } from 'react';

const Social = ({ userProfile }) => {
  const [showPopup, setShowPopup] = useState(false);

  const toggleSocialPopup = () => {
    setShowPopup(!showPopup);
  };

  const handlePostAction = (type) => {
    setShowPopup(false);
    if (window.Swal) {
      window.Swal.fire({
        icon: 'info',
        title: type === 'image' ? 'อัปโหลดรูปภาพ' : 'แนบลิงก์ URL',
        text: 'ฟังก์ชันนี้กำลังพัฒนา',
        confirmButtonColor: '#3ACE00',
      });
    }
  };

  const posts = [
    {
      id: 1,
      author: 'Somsak K.',
      time: '10 นาทีที่แล้ว',
      content: 'ช่วยดูหน่อยครับ อันนี้ลิงก์จริงหรือปลอม? มี SMS ส่งมาบอกว่าได้รับเงินคืนภาษี',
      image: '/img/scam1.png',
      likes: 12,
      comments: 4,
    },
    {
      id: 2,
      author: 'Manee_Ja',
      time: '1 ชั่วโมงที่แล้ว',
      content: 'เตือนภัยค่ะ! 🚨 เบอร์ 02-xxx-xxxx โทรมาอ้างว่าเป็นเจ้าหน้าที่จาก DHL บอกมีพัสดุตกค้าง อย่าหลงเชื่อนะคะ เพิ่งวางสายเมื่อกี้เลย น่ากลัวมาก',
      likes: 45,
      comments: 8,
    },
    {
      id: 3,
      author: 'Chai_Dev',
      time: '3 ชั่วโมงที่แล้ว',
      content: 'เจอเว็บนี้ยิงโฆษณาในเฟสบุ๊คครับ อ้างว่าลงทุนได้กำไร 100% ภายใน 5 นาที ระวังกันด้วยนะครับ น่าจะเป็นเว็บพนันแฝง 🚫',
      image: '/img/scam2.png',
      likes: 89,
      comments: 21,
    },
    {
      id: 4,
      author: 'Nong_Aum',
      time: '5 ชั่วโมงที่แล้ว',
      content: 'สอบถามค่ะ มีข้อความส่งมาให้ยืนยันตัวตนธนาคารกสิกร ลิงก์นี้ของจริงไหมคะ? kbank-verify-secure.com ลองกดสแกนในแอปแล้วขึ้นสีแดงค่ะ 😰',
      likes: 34,
      comments: 15,
    },
  ];

  return (
    <section id="social-page">
      <div className="social-controls">
        <div className="post-input-box">
          <div className="user-mini-avatar">
            <img
              src={userProfile?.pictureUrl || '/img/profile.png'}
              className="avatar-img"
              alt="User"
            />
          </div>
          <input
            type="text"
            placeholder="มีอะไรน่าสงสัย? โพสต์ถามเลย..."
            readOnly
            onClick={toggleSocialPopup}
          />
        </div>

        <div className="add-btn-wrapper" style={{ position: 'relative' }}>
          <button className="social-circle-btn" onClick={toggleSocialPopup}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>

          <div className={`social-popup ${showPopup ? 'active' : ''}`}>
            <div className="popup-item" onClick={() => handlePostAction('image')}>
              <div className="popup-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <span>รูปภาพ</span>
            </div>
            <div className="popup-item" onClick={() => handlePostAction('link')}>
              <div className="popup-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </div>
              <span>ลิงก์ URL</span>
            </div>
          </div>
        </div>

        <button className="social-circle-btn filter-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </button>
      </div>

      <div className="social-feed">
        {posts.map((post) => (
          <div key={post.id} className="social-card">
            <div className="post-header">
              <img src="/img/profile.png" className="post-avatar" alt="User" />
              <div className="post-info">
                <h4 className="post-author">{post.author}</h4>
                <span className="post-time">{post.time}</span>
              </div>
              <button className="more-btn">...</button>
            </div>
            <div className="post-content">
              <p>{post.content}</p>
              {post.image && (
                <div className="post-image-container">
                  <img
                    src={post.image}
                    alt="Post image"
                    style={{ width: '100%', borderRadius: '12px', display: 'block' }}
                  />
                </div>
              )}
            </div>
            <div className="post-actions">
              <button className="action-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
                {post.likes}
              </button>
              <button className="action-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                {post.comments}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Social;
