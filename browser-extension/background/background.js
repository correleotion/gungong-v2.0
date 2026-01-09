// Background Service Worker

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('GunGong Extension installed');

  // Create context menus
  createContextMenus();

  // Set default settings
  chrome.storage.sync.get(['apiBaseURL'], (result) => {
    if (!result.apiBaseURL) {
      chrome.storage.sync.set({
        apiBaseURL: 'http://localhost:8000',
        autoScan: true,
        notifications: true
      });
    }
  });
});

/**
 * Create context menus
 */
function createContextMenus() {
  // Main menu
  chrome.contextMenus.create({
    id: 'gungong-main',
    title: 'GunGong - ตรวจสอบการฉ้อโกง',
    contexts: ['selection', 'page']
  });

  // Check selected data
  chrome.contextMenus.create({
    id: 'gungong-check',
    parentId: 'gungong-main',
    title: 'ตรวจสอบข้อมูลที่เลือก',
    contexts: ['selection']
  });

  // Analyze selected text
  chrome.contextMenus.create({
    id: 'gungong-analyze',
    parentId: 'gungong-main',
    title: 'วิเคราะห์ความเสี่ยง',
    contexts: ['selection']
  });

  // Scan page
  chrome.contextMenus.create({
    id: 'gungong-scan',
    parentId: 'gungong-main',
    title: 'สแกนหน้านี้',
    contexts: ['page']
  });
}

/**
 * Handle context menu clicks
 */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  switch (info.menuItemId) {
    case 'gungong-check':
      await handleCheckSelection(info, tab);
      break;
    case 'gungong-analyze':
      await handleAnalyzeSelection(info, tab);
      break;
    case 'gungong-scan':
      await handleScanPage(tab);
      break;
  }
});

/**
 * Handle check selection
 */
async function handleCheckSelection(info, tab) {
  const selection = info.selectionText.trim();

  if (!selection) return;

  // Extract phone numbers and bank accounts
  const response = await chrome.tabs.sendMessage(tab.id, {
    type: 'SCAN_SELECTION'
  });

  if (response.phones.length > 0 || response.accounts.length > 0) {
    // Check all found data
    const allData = [...response.phones, ...response.accounts];

    for (const data of allData) {
      await checkBlacklist(data, tab);
    }
  } else {
    // Check the selection directly
    await checkBlacklist(selection, tab);
  }
}

/**
 * Handle analyze selection
 */
async function handleAnalyzeSelection(info, tab) {
  const selection = info.selectionText.trim();

  if (!selection) return;

  await analyzeFraud(selection, tab);
}

/**
 * Handle scan page
 */
async function handleScanPage(tab) {
  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'SCAN_PAGE' });

    // Show notification
    const settings = await chrome.storage.sync.get(['notifications']);
    if (settings.notifications !== false) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '../assets/icons/icon48.png',
        title: 'GunGong',
        message: 'กำลังสแกนหน้าเว็บ...'
      });
    }
  } catch (error) {
    console.error('Error scanning page:', error);
  }
}

/**
 * Check data against blacklist
 */
async function checkBlacklist(data, tab) {
  try {
    const storage = await chrome.storage.sync.get(['apiBaseURL', 'notifications']);
    const baseURL = storage.apiBaseURL || 'http://localhost:8000';

    const response = await fetch(`${baseURL}/blacklist/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Show notification if enabled
    if (storage.notifications !== false) {
      if (result.found) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: '../assets/icons/icon48.png',
          title: '⚠️ พบในบัญชีดำ!',
          message: `${data}\n${result.description || 'ข้อมูลนี้ถูกรายงานว่าเป็นการฉ้อโกง'}`,
          priority: 2
        });
      } else {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: '../assets/icons/icon48.png',
          title: '✓ ปลอดภัย',
          message: `${data}\nไม่พบในบัญชีดำ`,
          priority: 1
        });
      }
    }

    // Save to history
    await saveHistory({
      type: 'check',
      value: data,
      result: result.found ? 'danger' : 'safe',
      details: result,
      url: tab.url
    });

    return result;
  } catch (error) {
    console.error('Error checking blacklist:', error);

    if (storage.notifications !== false) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '../assets/icons/icon48.png',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'
      });
    }
  }
}

/**
 * Analyze text for fraud
 */
async function analyzeFraud(text, tab) {
  try {
    const storage = await chrome.storage.sync.get(['apiBaseURL', 'notifications']);
    const baseURL = storage.apiBaseURL || 'http://localhost:8000';

    const response = await fetch(`${baseURL}/fraud-v2/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Determine risk level
    let riskClass = 'unknown';
    let riskEmoji = 'ℹ️';

    if (result.risk_level) {
      const risk = result.risk_level.toLowerCase();
      if (risk.includes('high') || risk.includes('สูง')) {
        riskClass = 'danger';
        riskEmoji = '🚨';
      } else if (risk.includes('medium') || risk.includes('ปานกลาง')) {
        riskClass = 'warning';
        riskEmoji = '⚠️';
      } else if (risk.includes('low') || risk.includes('ต่ำ')) {
        riskClass = 'safe';
        riskEmoji = '✓';
      }
    }

    // Show notification if enabled
    if (storage.notifications !== false) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '../assets/icons/icon48.png',
        title: `${riskEmoji} ระดับความเสี่ยง: ${result.risk_level || 'ไม่ทราบ'}`,
        message: result.analysis || 'วิเคราะห์ข้อความเสร็จสิ้น',
        priority: riskClass === 'danger' ? 2 : 1
      });
    }

    // Save to history
    await saveHistory({
      type: 'analyze',
      value: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      result: riskClass,
      details: result,
      url: tab.url
    });

    return result;
  } catch (error) {
    console.error('Error analyzing fraud:', error);

    const storage = await chrome.storage.sync.get(['notifications']);
    if (storage.notifications !== false) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '../assets/icons/icon48.png',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถวิเคราะห์ข้อความได้'
      });
    }
  }
}

/**
 * Save to history
 */
async function saveHistory(record) {
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

/**
 * Handle messages from content scripts and popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'DATA_DETECTED') {
    // Store detected data for popup to access
    chrome.storage.local.set({ lastDetected: request.data });

    // Optionally auto-check if enabled
    chrome.storage.sync.get(['autoCheck'], async (result) => {
      if (result.autoCheck) {
        const tab = sender.tab;
        for (const phone of request.data.phones) {
          await checkBlacklist(phone, tab);
        }
        for (const account of request.data.accounts) {
          await checkBlacklist(account, tab);
        }
      }
    });

    sendResponse({ success: true });
  } else if (request.type === 'CHECK_DATA') {
    // Handle inline check from highlighted data
    const tab = sender.tab;
    checkBlacklist(request.data.value, tab).then(result => {
      sendResponse({ success: true, result });
    });
    return true; // Keep channel open for async response
  }

  return true;
});

// Handle extension icon click (optional - opens popup by default)
chrome.action.onClicked.addListener((tab) => {
  // This won't fire if popup is defined in manifest
  // But can be used if you remove the popup and want custom behavior
  console.log('Extension icon clicked');
});

console.log('GunGong Background Service Worker loaded');
