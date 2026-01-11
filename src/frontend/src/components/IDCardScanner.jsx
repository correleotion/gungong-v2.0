import React, { useState, useRef } from 'react';

const IDCardScanner = ({ onNavigate }) => {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualIdNumber, setManualIdNumber] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Open camera
  const openCamera = async () => {
    try {
      // Check browser compatibility
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        window.Swal?.fire({
          icon: 'error',
          title: 'ไม่รองรับกล้อง',
          text: 'เบราว์เซอร์ของคุณไม่รองรับการเปิดกล้อง',
          confirmButtonColor: '#3ACE00'
        });
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      setStream(mediaStream);

      // Wait for React to update, then set video source
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(err => {
            console.error('Video play error:', err);
          });
        }
      }, 100);
    } catch (error) {
      console.error('Camera error:', error);
      window.Swal?.fire({
        icon: 'error',
        title: 'ไม่สามารถเปิดกล้องได้',
        text: 'กรุณาอนุญาตการเข้าถึงกล้องในเบราว์เซอร์',
        confirmButtonColor: '#3ACE00'
      });
    }
  };

  // Capture photo from video
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 (JPEG, 80% quality)
    const base64Image = canvas.toDataURL('image/jpeg', 0.8);

    setCapturedImage(base64Image);
    setShowPreview(true);
    stopCamera();
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Handle file selection from gallery
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      window.Swal?.fire({
        icon: 'error',
        title: 'ไฟล์ไม่ถูกต้อง',
        text: 'กรุณาเลือกไฟล์รูปภาพ',
        confirmButtonColor: '#3ACE00'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target.result);
      setShowPreview(true);
    };
    reader.readAsDataURL(file);
  };

  // Verify ID card by manual input
  const verifyManualIdCard = async () => {
    if (!manualIdNumber || manualIdNumber.length !== 13) {
      window.Swal?.fire({
        icon: 'warning',
        title: 'กรุณากรอกเลขบัตร',
        text: 'กรุณากรอกเลขบัตรประชาชน 13 หลัก',
        confirmButtonColor: '#3ACE00'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/v2/verify-id-number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_number: manualIdNumber,
          user_id: 'web-user'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'API Error');
      }

      // Show result
      showResult(data);
      setManualIdNumber('');

    } catch (error) {
      console.error('Verification error:', error);
      window.Swal?.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.message || 'ไม่สามารถตรวจสอบบัตรได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonColor: '#3ACE00'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify ID card
  const verifyIDCard = async () => {
    if (!capturedImage) return;

    setIsLoading(true);

    try {
      // Remove data URI prefix (data:image/jpeg;base64,)
      const base64Data = capturedImage.replace(/^data:image\/[a-z]+;base64,/, '');

      const response = await fetch('/api/v2/verify-id-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_base64: base64Data,
          user_id: 'web-user'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'API Error');
      }

      // Show result with SweetAlert
      showResult(data);

    } catch (error) {
      console.error('Verification error:', error);
      window.Swal?.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.message || 'ไม่สามารถตรวจสอบบัตรได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonColor: '#3ACE00'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show verification result
  const showResult = (data) => {
    const extracted = data.extracted_data || {};
    const idNumber = data.id_number || '-';
    const isValid = data.is_valid_format;
    const isBlacklisted = data.is_blacklisted;
    const isSafe = data.is_safe;
    const riskLevel = data.risk_level || 'UNKNOWN';
    const reportsCount = data.reports_count || 0;

    // Determine icon and color
    let icon = 'success';
    let color = '#00C851';
    let statusText = 'ปลอดภัย';

    if (isBlacklisted) {
      icon = 'error';
      color = '#FF4444';
      statusText = 'พบในบัญชีดำ';
    } else if (!isValid) {
      icon = 'warning';
      color = '#FF8C00';
      statusText = 'รูปแบบไม่ถูกต้อง';
    }

    const htmlContent = `
      <div style="text-align: left; padding: 20px;">
        <h3 style="color: ${color}; margin-bottom: 20px; text-align: center;">${statusText}</h3>

        <div style="margin-bottom: 15px;">
          <strong>📋 ข้อมูลบัตร</strong>
          <div style="margin-left: 20px; margin-top: 8px;">
            <p style="margin: 5px 0;">เลขบัตร: <strong>${idNumber}</strong></p>
            <p style="margin: 5px 0;">ชื่อ-นามสกุล: ${extracted.name_th || '-'} ${extracted.surname_th || '-'}</p>
            <p style="margin: 5px 0;">วันเกิด: ${extracted.date_of_birth || '-'}</p>
            <p style="margin: 5px 0;">ที่อยู่: ${extracted.address ? extracted.address.substring(0, 50) + '...' : '-'}</p>
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <strong>🔍 ผลการตรวจสอบ</strong>
          <div style="margin-left: 20px; margin-top: 8px;">
            <p style="margin: 5px 0;">รูปแบบถูกต้อง: ${isValid ? '✅ ใช่' : '❌ ไม่ใช่'}</p>
            <p style="margin: 5px 0;">อยู่ใน Blacklist: ${isBlacklisted ? '⚠️ ใช่' : '✅ ไม่'}</p>
            <p style="margin: 5px 0;">ระดับความเสี่ยง: <strong>${riskLevel}</strong></p>
            <p style="margin: 5px 0;">จำนวนรายงาน: ${reportsCount} ครั้ง</p>
          </div>
        </div>

        ${isBlacklisted || !isValid ? `
          <div style="background: #FFF3CD; padding: 10px; border-radius: 5px; margin-top: 15px;">
            <strong style="color: #856404;">⚠️ คำเตือน</strong>
            <p style="color: #856404; margin: 5px 0; font-size: 14px;">
              ${isBlacklisted ? `เลขบัตรนี้มี ${reportsCount} รายงานการฉ้อโกง` : 'เลขบัตรไม่ผ่านการตรวจสอบ checksum'}
            </p>
            <p style="color: #856404; margin: 5px 0; font-size: 14px;">
              ควรตรวจสอบกับหน่วยงานราชการเพิ่มเติม
            </p>
          </div>
        ` : ''}
      </div>
    `;

    window.Swal?.fire({
      icon: icon,
      title: 'ผลการตรวจสอบบัตรประชาชน',
      html: htmlContent,
      confirmButtonColor: '#3ACE00',
      confirmButtonText: 'ตกลง',
      width: '600px'
    });
  };

  // Retake photo
  const retake = () => {
    setCapturedImage(null);
    setShowPreview(false);
  };

  // Go back
  const goBack = () => {
    stopCamera();
    if (onNavigate) {
      onNavigate('verify');
    }
  };

  return (
    <section id="id-card-scanner-page">
      <div className="section-content">
        {/* Header */}
        <div className="scanner-subpage-header">
          <button className="back-btn-modern" onClick={goBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div className="subpage-title-block">
            <div className="subpage-icon icon-id-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                <line x1="7" y1="8" x2="7.01" y2="8"></line>
                <line x1="7" y1="12" x2="17" y2="12"></line>
                <line x1="7" y1="16" x2="17" y2="16"></line>
              </svg>
            </div>
            <div>
              <h2>ยืนยันบัตรประชาชน</h2>
              <p className="subpage-subtitle">สแกนบัตรประชาชนด้วยกล้อง</p>
            </div>
          </div>
        </div>

        <div className="scanner-form-card">
          {/* Manual Input Section */}
          {!showPreview && !stream && !showManualInput && (
            <div style={{ marginBottom: '20px' }}>
              <button
                className="form-submit-btn"
                onClick={() => setShowManualInput(true)}
                style={{ width: '100%', background: '#2196F3' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px', marginRight: '8px' }}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                พิมพ์เลขบัตรเอง
              </button>
            </div>
          )}

          {/* Manual Input Form */}
          {showManualInput && !showPreview && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
                เลขบัตรประชาชน
              </label>
              <input
                type="text"
                maxLength="13"
                value={manualIdNumber}
                onChange={(e) => setManualIdNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="1-2345-67890-12-3"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                กรุณากรอกข้อมูลให้ถูกต้อง
              </p>
              <button
                className="form-submit-btn"
                onClick={verifyManualIdCard}
                disabled={isLoading || manualIdNumber.length !== 13}
                style={{ width: '100%', marginBottom: '10px' }}
              >
                {isLoading ? 'กำลังตรวจสอบ...' : 'ยืนยัน'}
              </button>
              <button
                className="form-submit-btn"
                onClick={() => {
                  setShowManualInput(false);
                  setManualIdNumber('');
                }}
                style={{ width: '100%', background: '#888' }}
              >
                ยกเลิก
              </button>
            </div>
          )}

          {/* Instructions */}
          {!showPreview && !stream && !showManualInput && (
            <div className="instruction-box" style={{ marginBottom: '20px', padding: '15px', background: '#F0F8FF', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2196F3' }}>📝 วิธีถ่ายรูปให้ชัด</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#555' }}>
                <li>วางบัตรบนพื้นเรียบ แสงสว่างเพียงพอ</li>
                <li>ถ่ายรูปด้านหน้าบัตร ให้เห็นข้อมูลชัดเจน</li>
                <li>หลีกเลี่ยงแสงสะท้อนและเงา</li>
              </ul>
            </div>
          )}

          {/* Video Stream */}
          {stream && !showPreview && (
            <>
              <div style={{
                marginBottom: '20px',
                position: 'relative',
                width: '100%',
                paddingBottom: '62.5%',
                background: '#000',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={(e) => {
                    console.log('Video metadata loaded');
                    e.target.play().catch(err => console.error('Play error:', err));
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '90%',
                  height: '85%',
                  border: '3px solid rgba(255, 255, 255, 0.6)',
                  borderRadius: '8px',
                  pointerEvents: 'none',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3)'
                }}></div>
              </div>
              <button
                className="form-submit-btn"
                onClick={capturePhoto}
                style={{ marginTop: '15px', width: '100%' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px', marginRight: '8px' }}>
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                ถ่ายรูป
              </button>
              <button
                className="form-submit-btn"
                onClick={stopCamera}
                style={{ marginTop: '10px', width: '100%', background: '#888' }}
              >
                ปิดกล้อง
              </button>
            </>
          )}

          {/* Image Preview */}
          {showPreview && capturedImage && (
            <div style={{ marginBottom: '20px' }}>
              <img
                src={capturedImage}
                alt="ID Card Preview"
                style={{ width: '100%', borderRadius: '8px', marginBottom: '15px' }}
              />

              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div className="loading-spinner" style={{ margin: '0 auto 10px' }}></div>
                  <p>กำลังตรวจสอบบัตร...</p>
                </div>
              ) : (
                <>
                  <button
                    className="form-submit-btn"
                    onClick={verifyIDCard}
                    style={{ width: '100%', marginBottom: '10px' }}
                  >
                    ✅ ตรวจสอบบัตร
                  </button>
                  <button
                    className="form-submit-btn"
                    onClick={retake}
                    style={{ width: '100%', background: '#888' }}
                  >
                    🔄 ถ่ายใหม่
                  </button>
                </>
              )}
            </div>
          )}

          {/* Camera and Gallery Buttons */}
          {!stream && !showPreview && (
            <div>
              <button
                className="form-submit-btn"
                onClick={openCamera}
                style={{ width: '100%', marginBottom: '10px' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px', marginRight: '8px' }}>
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                เปิดกล้อง
              </button>

              <label
                htmlFor="file-input"
                className="form-submit-btn"
                style={{
                  width: '100%',
                  display: 'inline-block',
                  textAlign: 'center',
                  background: '#666',
                  cursor: 'pointer'
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                เลือกจากคลัง
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>

        {/* Hidden Canvas for capturing */}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
    </section>
  );
};

export default IDCardScanner;
