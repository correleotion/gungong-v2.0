// Options Page Script

// Default settings
const DEFAULT_SETTINGS = {
  apiBaseURL: 'http://localhost:8000',
  autoScan: true,
  autoCheck: false,
  highlightData: true,
  notifications: true,
  notifyDangerOnly: false,
  saveHistory: true
};

// Load settings on page load
document.addEventListener('DOMContentLoaded', loadSettings);

// Save button
document.getElementById('saveBtn').addEventListener('click', saveSettings);

// Cancel button
document.getElementById('cancelBtn').addEventListener('click', () => {
  window.close();
});

// Reset button
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('คุณต้องการรีเซ็ตการตั้งค่าทั้งหมดเป็นค่าเริ่มต้นหรือไม่?')) {
    resetSettings();
  }
});

// Test connection button
document.getElementById('testConnectionBtn').addEventListener('click', testConnection);

// Clear history button
document.getElementById('clearHistoryBtn').addEventListener('click', async () => {
  if (confirm('คุณต้องการลบประวัติทั้งหมดหรือไม่?')) {
    await chrome.storage.local.remove('history');
    showToast('ลบประวัติเรียบร้อยแล้ว', 'success');
  }
});

// Clear cache button
document.getElementById('clearCacheBtn').addEventListener('click', async () => {
  if (confirm('คุณต้องการล้าง cache ทั้งหมดหรือไม่?')) {
    await chrome.storage.local.clear();
    showToast('ล้าง cache เรียบร้อยแล้ว', 'success');
  }
});

/**
 * Load settings from storage
 */
async function loadSettings() {
  try {
    const settings = await chrome.storage.sync.get(Object.keys(DEFAULT_SETTINGS));

    // Merge with defaults
    const finalSettings = { ...DEFAULT_SETTINGS, ...settings };

    // Apply to form
    document.getElementById('apiBaseURL').value = finalSettings.apiBaseURL;
    document.getElementById('autoScan').checked = finalSettings.autoScan;
    document.getElementById('autoCheck').checked = finalSettings.autoCheck;
    document.getElementById('highlightData').checked = finalSettings.highlightData;
    document.getElementById('notifications').checked = finalSettings.notifications;
    document.getElementById('notifyDangerOnly').checked = finalSettings.notifyDangerOnly;
    document.getElementById('saveHistory').checked = finalSettings.saveHistory;

  } catch (error) {
    console.error('Error loading settings:', error);
    showToast('เกิดข้อผิดพลาดในการโหลดการตั้งค่า', 'error');
  }
}

/**
 * Save settings to storage
 */
async function saveSettings() {
  const saveBtn = document.getElementById('saveBtn');
  saveBtn.disabled = true;
  saveBtn.classList.add('loading');

  try {
    const settings = {
      apiBaseURL: document.getElementById('apiBaseURL').value.trim() || DEFAULT_SETTINGS.apiBaseURL,
      autoScan: document.getElementById('autoScan').checked,
      autoCheck: document.getElementById('autoCheck').checked,
      highlightData: document.getElementById('highlightData').checked,
      notifications: document.getElementById('notifications').checked,
      notifyDangerOnly: document.getElementById('notifyDangerOnly').checked,
      saveHistory: document.getElementById('saveHistory').checked
    };

    // Validate API URL
    if (settings.apiBaseURL) {
      try {
        new URL(settings.apiBaseURL);
      } catch {
        showToast('URL ของ API ไม่ถูกต้อง', 'error');
        saveBtn.disabled = false;
        saveBtn.classList.remove('loading');
        return;
      }
    }

    // Save to storage
    await chrome.storage.sync.set(settings);

    showToast('บันทึกการตั้งค่าเรียบร้อยแล้ว', 'success');

    // Reload extension if needed
    setTimeout(() => {
      chrome.runtime.reload();
    }, 1000);

  } catch (error) {
    console.error('Error saving settings:', error);
    showToast('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า', 'error');
  } finally {
    saveBtn.disabled = false;
    saveBtn.classList.remove('loading');
  }
}

/**
 * Reset settings to default
 */
async function resetSettings() {
  try {
    await chrome.storage.sync.set(DEFAULT_SETTINGS);
    await loadSettings();
    showToast('รีเซ็ตการตั้งค่าเรียบร้อยแล้ว', 'success');
  } catch (error) {
    console.error('Error resetting settings:', error);
    showToast('เกิดข้อผิดพลาดในการรีเซ็ตการตั้งค่า', 'error');
  }
}

/**
 * Test API connection
 */
async function testConnection() {
  const btn = document.getElementById('testConnectionBtn');
  const statusDiv = document.getElementById('connectionStatus');
  const apiURL = document.getElementById('apiBaseURL').value.trim();

  if (!apiURL) {
    showStatusMessage('กรุณากรอก URL ของ API', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ กำลังทดสอบ...';
  statusDiv.style.display = 'none';

  try {
    // Validate URL
    const url = new URL(apiURL);

    // Test connection with health endpoint
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${apiURL}/health`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      showStatusMessage(
        `✓ เชื่อมต่อสำเร็จ! (${data.status || 'OK'})`,
        'success'
      );
    } else {
      showStatusMessage(
        `⚠️ เซิร์ฟเวอร์ตอบกลับด้วยสถานะ: ${response.status}`,
        'error'
      );
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      showStatusMessage('⚠️ การเชื่อมต่อใช้เวลานานเกินไป (timeout)', 'error');
    } else if (error.message.includes('Failed to fetch')) {
      showStatusMessage(
        '❌ ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบ URL และการเชื่อมต่ออินเทอร์เน็ต',
        'error'
      );
    } else {
      showStatusMessage(`❌ เกิดข้อผิดพลาด: ${error.message}`, 'error');
    }
  } finally {
    btn.disabled = false;
    btn.textContent = '🔍 ทดสอบการเชื่อมต่อ';
  }
}

/**
 * Show status message
 */
function showStatusMessage(message, type = 'info') {
  const statusDiv = document.getElementById('connectionStatus');
  statusDiv.textContent = message;
  statusDiv.className = `status-message status-${type}`;
  statusDiv.style.display = 'block';
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;

  // Show toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Handle Enter key on API URL input
document.getElementById('apiBaseURL').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    testConnection();
  }
});

// Add change listeners to show unsaved changes indicator
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
  input.addEventListener('change', () => {
    // Could add an indicator that there are unsaved changes
    console.log('Settings changed (unsaved)');
  });
});
