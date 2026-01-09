// Popup Script

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');

    // Load history if history tab is opened
    if (tabName === 'history') {
      loadHistory();
    }
  });
});

// ตรวจสอบข้อมูล (หมายเลขโทรศัพท์/บัญชีธนาคาร)
document.getElementById('checkBtn').addEventListener('click', async () => {
  const input = document.getElementById('dataInput').value.trim();
  const resultsDiv = document.getElementById('checkResults');
  const contentDiv = document.getElementById('resultContent');
  const badge = document.getElementById('resultBadge');
  const btn = document.getElementById('checkBtn');

  if (!input) {
    alert('กรุณากรอกหมายเลขโทรศัพท์หรือบัญชีธนาคาร');
    return;
  }

  // Show loading
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'กำลังตรวจสอบ...';
  btn.querySelector('.spinner').style.display = 'inline';
  resultsDiv.style.display = 'none';

  try {
    // Get API base URL from storage
    const storage = await chrome.storage.sync.get(['apiBaseURL']);
    const baseURL = storage.apiBaseURL || 'http://localhost:8000';

    // Call API
    const response = await fetch(`${baseURL}/blacklist/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: input })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Display results
    resultsDiv.style.display = 'block';

    if (result.found) {
      badge.className = 'badge badge-danger';
      badge.textContent = 'อันตราย';
      contentDiv.innerHTML = `
        <p><strong>⚠️ พบในบัญชีดำ!</strong></p>
        <p><strong>ข้อมูล:</strong> ${result.data}</p>
        ${result.type ? `<p><strong>ประเภท:</strong> ${result.type}</p>` : ''}
        ${result.description ? `<p><strong>รายละเอียด:</strong> ${result.description}</p>` : ''}
        ${result.reports ? `<p><strong>จำนวนรายงาน:</strong> ${result.reports}</p>` : ''}
      `;
    } else {
      badge.className = 'badge badge-safe';
      badge.textContent = 'ปลอดภัย';
      contentDiv.innerHTML = `
        <p><strong>✓ ไม่พบในบัญชีดำ</strong></p>
        <p>ข้อมูลนี้ยังไม่มีรายงานการฉ้อโกง</p>
      `;
    }

    // Save to history
    await saveToHistory({
      type: 'check',
      value: input,
      result: result.found ? 'danger' : 'safe',
      details: result
    });

  } catch (error) {
    console.error('Error checking data:', error);
    contentDiv.innerHTML = `
      <div class="error-message">
        <strong>เกิดข้อผิดพลาด:</strong> ${error.message}<br>
        กรุณาตรวจสอบการเชื่อมต่อและลองอีกครั้ง
      </div>
    `;
    resultsDiv.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = 'ตรวจสอบ';
    btn.querySelector('.spinner').style.display = 'none';
  }
});

// วิเคราะห์ข้อความ
document.getElementById('analyzeBtn').addEventListener('click', async () => {
  const input = document.getElementById('textInput').value.trim();
  const resultsDiv = document.getElementById('analyzeResults');
  const contentDiv = document.getElementById('analyzeContent');
  const badge = document.getElementById('analyzeBadge');
  const btn = document.getElementById('analyzeBtn');

  if (!input) {
    alert('กรุณากรอกข้อความที่ต้องการวิเคราะห์');
    return;
  }

  // Show loading
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'กำลังวิเคราะห์...';
  btn.querySelector('.spinner').style.display = 'inline';
  resultsDiv.style.display = 'none';

  try {
    // Get API base URL from storage
    const storage = await chrome.storage.sync.get(['apiBaseURL']);
    const baseURL = storage.apiBaseURL || 'http://localhost:8000';

    // Call API
    const response = await fetch(`${baseURL}/fraud-v2/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Display results
    resultsDiv.style.display = 'block';

    // Determine risk level
    let riskClass = 'unknown';
    let riskText = 'ไม่ทราบ';

    if (result.risk_level) {
      const risk = result.risk_level.toLowerCase();
      if (risk.includes('high') || risk.includes('สูง')) {
        riskClass = 'danger';
        riskText = 'สูง';
      } else if (risk.includes('medium') || risk.includes('ปานกลาง')) {
        riskClass = 'warning';
        riskText = 'ปานกลาง';
      } else if (risk.includes('low') || risk.includes('ต่ำ')) {
        riskClass = 'safe';
        riskText = 'ต่ำ';
      }
    }

    badge.className = `badge badge-${riskClass}`;
    badge.textContent = `ความเสี่ยง: ${riskText}`;

    contentDiv.innerHTML = `
      <p><strong>ระดับความเสี่ยง:</strong> ${result.risk_level || 'ไม่ทราบ'}</p>
      ${result.analysis ? `<p><strong>การวิเคราะห์:</strong><br>${result.analysis}</p>` : ''}
      ${result.warning_signs ? `<p><strong>สัญญาณเตือน:</strong><br>${Array.isArray(result.warning_signs) ? result.warning_signs.join(', ') : result.warning_signs}</p>` : ''}
      ${result.recommendation ? `<p><strong>คำแนะนำ:</strong><br>${result.recommendation}</p>` : ''}
    `;

    // Save to history
    await saveToHistory({
      type: 'analyze',
      value: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
      result: riskClass,
      details: result
    });

  } catch (error) {
    console.error('Error analyzing text:', error);
    contentDiv.innerHTML = `
      <div class="error-message">
        <strong>เกิดข้อผิดพลาด:</strong> ${error.message}<br>
        กรุณาตรวจสอบการเชื่อมต่อและลองอีกครั้ง
      </div>
    `;
    resultsDiv.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = 'วิเคราะห์';
    btn.querySelector('.spinner').style.display = 'none';
  }
});

// สแกนหน้าเว็บ
document.getElementById('scanPageBtn').addEventListener('click', async () => {
  const resultsDiv = document.getElementById('scanResults');
  const btn = document.getElementById('scanPageBtn');

  btn.disabled = true;
  btn.textContent = '⏳ กำลังสแกน...';

  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'SCAN_PAGE' });

    // Wait a bit for detection
    setTimeout(async () => {
      const storage = await chrome.storage.local.get(['lastDetected']);
      const detected = storage.lastDetected;

      if (detected && (detected.phones.length > 0 || detected.accounts.length > 0)) {
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
          <p><strong>พบข้อมูลที่ควรตรวจสอบ:</strong></p>
          ${detected.phones.length > 0 ? `
            <p><strong>หมายเลขโทรศัพท์:</strong></p>
            ${detected.phones.map(phone => `
              <div class="scan-item">
                <span class="scan-item-value">${phone}</span>
                <button class="btn-text" onclick="checkData('${phone}')">ตรวจสอบ</button>
              </div>
            `).join('')}
          ` : ''}
          ${detected.accounts.length > 0 ? `
            <p><strong>บัญชีธนาคาร:</strong></p>
            ${detected.accounts.map(account => `
              <div class="scan-item">
                <span class="scan-item-value">${account}</span>
                <button class="btn-text" onclick="checkData('${account}')">ตรวจสอบ</button>
              </div>
            `).join('')}
          ` : ''}
        `;
      } else {
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = '<p class="empty-message">ไม่พบหมายเลขโทรศัพท์หรือบัญชีธนาคารในหน้านี้</p>';
      }

      btn.disabled = false;
      btn.textContent = '🔍 สแกนหน้าเว็บนี้';
    }, 1000);

  } catch (error) {
    console.error('Error scanning page:', error);
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = `
      <div class="error-message">
        <strong>เกิดข้อผิดพลาด:</strong> ไม่สามารถสแกนหน้านี้ได้<br>
        กรุณารีเฟรชหน้าและลองอีกครั้ง
      </div>
    `;
    btn.disabled = false;
    btn.textContent = '🔍 สแกนหน้าเว็บนี้';
  }
});

// Helper function for inline check
window.checkData = function(value) {
  document.getElementById('dataInput').value = value;
  document.querySelector('.tab-btn[data-tab="check"]').click();
  document.getElementById('checkBtn').click();
};

// Load history
async function loadHistory() {
  const listDiv = document.getElementById('historyList');
  const storage = await chrome.storage.local.get(['history']);
  const history = storage.history || [];

  if (history.length === 0) {
    listDiv.innerHTML = '<p class="empty-message">ยังไม่มีประวัติการตรวจสอบ</p>';
    return;
  }

  listDiv.innerHTML = history.map(item => `
    <div class="history-item" onclick="viewHistoryItem(${item.id})">
      <div class="history-item-header">
        <span class="history-item-value">${item.value}</span>
        <span class="badge badge-${item.result}">${item.result === 'danger' ? 'อันตราย' : item.result === 'warning' ? 'เตือน' : 'ปลอดภัย'}</span>
      </div>
      <div class="history-item-time">${formatTime(item.timestamp)}</div>
      <div class="history-item-result">${item.type === 'check' ? 'ตรวจสอบข้อมูล' : 'วิเคราะห์ข้อความ'}</div>
    </div>
  `).join('');
}

// Save to history
async function saveToHistory(record) {
  const storage = await chrome.storage.local.get(['history']);
  const history = storage.history || [];

  const newRecord = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...record
  };

  history.unshift(newRecord);

  // Keep only last 100 records
  if (history.length > 100) {
    history.length = 100;
  }

  await chrome.storage.local.set({ history });
}

// Clear history
document.getElementById('clearHistoryBtn').addEventListener('click', async () => {
  if (confirm('คุณต้องการลบประวัติทั้งหมดหรือไม่?')) {
    await chrome.storage.local.remove('history');
    loadHistory();
  }
});

// Settings button
document.getElementById('settingsBtn').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// Format time
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return 'เมื่อสักครู่';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} นาทีที่แล้ว`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} ชั่วโมงที่แล้ว`;

  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// View history item detail
window.viewHistoryItem = function(id) {
  // Could implement a detail view modal
  console.log('View history item:', id);
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Load initial data
  loadHistory();
});
