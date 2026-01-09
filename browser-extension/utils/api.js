// API Configuration and Helper Functions
const API_CONFIG = {
  baseURL: 'http://localhost:8000', // เปลี่ยนเป็น URL ของ backend ที่ deploy แล้ว
  endpoints: {
    blacklist: '/blacklist/check',
    fraud: '/fraud/analyze',
    fraudV2: '/fraud-v2/analyze',
    history: '/history'
  }
};

/**
 * ดึง API URL จาก storage หรือใช้ค่า default
 */
async function getApiBaseURL() {
  const result = await chrome.storage.sync.get(['apiBaseURL']);
  return result.apiBaseURL || API_CONFIG.baseURL;
}

/**
 * ตรวจสอบหมายเลขโทรศัพท์/บัญชีธนาคารกับ blacklist
 * @param {string} data - หมายเลขโทรศัพท์หรือบัญชีธนาคาร
 * @returns {Promise<Object>} - ผลการตรวจสอบ
 */
async function checkBlacklist(data) {
  const baseURL = await getApiBaseURL();
  const url = `${baseURL}${API_CONFIG.endpoints.blacklist}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: data.trim() })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking blacklist:', error);
    throw error;
  }
}

/**
 * วิเคราะห์ข้อความเพื่อตรวจจับการฉ้อโกง (Fraud Detection V2)
 * @param {string} text - ข้อความที่ต้องการวิเคราะห์
 * @returns {Promise<Object>} - ผลการวิเคราะห์
 */
async function analyzeFraud(text) {
  const baseURL = await getApiBaseURL();
  const url = `${baseURL}${API_CONFIG.endpoints.fraudV2}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text.trim() })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing fraud:', error);
    throw error;
  }
}

/**
 * บันทึกประวัติการตรวจสอบ
 * @param {Object} record - ข้อมูลประวัติ
 */
async function saveHistory(record) {
  const history = await getHistory();
  const newRecord = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...record
  };

  history.unshift(newRecord);

  // เก็บแค่ 100 รายการล่าสุด
  if (history.length > 100) {
    history.length = 100;
  }

  await chrome.storage.local.set({ history });
}

/**
 * ดึงประวัติการตรวจสอบ
 * @returns {Promise<Array>} - รายการประวัติ
 */
async function getHistory() {
  const result = await chrome.storage.local.get(['history']);
  return result.history || [];
}

/**
 * ลบประวัติทั้งหมด
 */
async function clearHistory() {
  await chrome.storage.local.remove('history');
}

/**
 * แสดง notification
 * @param {string} title - หัวข้อ
 * @param {string} message - ข้อความ
 * @param {string} type - ประเภท (warning, danger, info)
 */
function showNotification(title, message, type = 'info') {
  const iconMap = {
    warning: 'assets/icons/warning.png',
    danger: 'assets/icons/danger.png',
    info: 'assets/icons/icon48.png'
  };

  chrome.notifications.create({
    type: 'basic',
    iconUrl: iconMap[type] || iconMap.info,
    title: title,
    message: message,
    priority: type === 'danger' ? 2 : 1
  });
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getApiBaseURL,
    checkBlacklist,
    analyzeFraud,
    saveHistory,
    getHistory,
    clearHistory,
    showNotification
  };
}
