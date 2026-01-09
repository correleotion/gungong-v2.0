// Content Script - Runs on all web pages to detect and highlight suspicious data

// Import patterns (will be injected)
const PHONE_PATTERNS = [
  /\b0[6-9]\d{1}[-\s]?\d{3}[-\s]?\d{4}\b/g,
  /\b\+66[-\s]?[6-9]\d{1}[-\s]?\d{3}[-\s]?\d{4}\b/g,
  /\b0[6-9]\d{8}\b/g
];

const BANK_ACCOUNT_PATTERNS = [
  /\b\d{3}[-\s]?\d{1}[-\s]?\d{5}[-\s]?\d{1}\b/g,
  /\b\d{3}[-\s]?\d{6}[-\s]?\d{1}\b/g,
  /\b\d{10,12}\b/g
];

let isScanning = false;
let detectedData = [];

/**
 * สแกนหาหมายเลขโทรศัพท์ในข้อความ
 */
function extractPhoneNumbers(text) {
  const phones = new Set();
  PHONE_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const cleaned = match.replace(/[-\s+]/g, '');
        const normalized = cleaned.startsWith('66') ? '0' + cleaned.substring(2) : cleaned;
        if (normalized.length === 10 && normalized.startsWith('0')) {
          phones.add(normalized);
        }
      });
    }
  });
  return Array.from(phones);
}

/**
 * สแกนหาเลขบัญชีธนาคารในข้อความ
 */
function extractBankAccounts(text) {
  const accounts = new Set();
  BANK_ACCOUNT_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const cleaned = match.replace(/[-\s]/g, '');
        if (cleaned.length >= 10 && cleaned.length <= 12 && /^\d+$/.test(cleaned)) {
          if (!cleaned.startsWith('0')) {
            accounts.add(cleaned);
          }
        }
      });
    }
  });
  return Array.from(accounts);
}

/**
 * สแกนเนื้อหาในหน้าเว็บ
 */
function scanPageContent() {
  if (isScanning) return;
  isScanning = true;
  detectedData = [];

  // ดึงข้อความจาก body (ไม่รวม script และ style)
  const bodyText = document.body.innerText;

  const phones = extractPhoneNumbers(bodyText);
  const accounts = extractBankAccounts(bodyText);

  if (phones.length > 0 || accounts.length > 0) {
    detectedData = {
      phones,
      accounts,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    // แจ้ง background script
    chrome.runtime.sendMessage({
      type: 'DATA_DETECTED',
      data: detectedData
    });

    // Highlight ข้อมูลที่พบ
    highlightDetectedData(phones, accounts);
  }

  isScanning = false;
}

/**
 * Highlight ข้อมูลที่ตรวจพบในหน้าเว็บ
 */
function highlightDetectedData(phones, accounts) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // ข้าม script, style, และ element ที่ซ่อน
        if (node.parentElement.tagName === 'SCRIPT' ||
            node.parentElement.tagName === 'STYLE' ||
            node.parentElement.tagName === 'NOSCRIPT') {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodesToReplace = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.textContent;

    let hasMatch = false;

    // ตรวจสอบว่ามีข้อมูลที่ต้อง highlight หรือไม่
    for (const phone of phones) {
      if (text.includes(phone)) {
        hasMatch = true;
        break;
      }
    }

    if (!hasMatch) {
      for (const account of accounts) {
        if (text.includes(account)) {
          hasMatch = true;
          break;
        }
      }
    }

    if (hasMatch) {
      nodesToReplace.push(node);
    }
  }

  // แทนที่ node ด้วย highlighted version
  nodesToReplace.forEach(node => {
    const span = document.createElement('span');
    let html = node.textContent;

    // Highlight phones
    phones.forEach(phone => {
      const regex = new RegExp(phone.replace(/[-\s]/g, '[-\\s]?'), 'g');
      html = html.replace(regex, `<mark class="gungong-highlight gungong-phone" data-value="${phone}">$&</mark>`);
    });

    // Highlight accounts
    accounts.forEach(account => {
      const regex = new RegExp(account.replace(/[-\s]/g, '[-\\s]?'), 'g');
      html = html.replace(regex, `<mark class="gungong-highlight gungong-account" data-value="${account}">$&</mark>`);
    });

    span.innerHTML = html;
    node.parentNode.replaceChild(span, node);
  });

  // เพิ่ม event listener สำหรับ highlighted elements
  addHighlightListeners();
}

/**
 * เพิ่ม click listener สำหรับ highlighted data
 */
function addHighlightListeners() {
  document.querySelectorAll('.gungong-highlight').forEach(element => {
    element.style.cursor = 'pointer';
    element.title = 'คลิกเพื่อตรวจสอบกับ GunGong';

    element.addEventListener('click', async (e) => {
      e.preventDefault();
      const value = e.target.getAttribute('data-value');
      const type = e.target.classList.contains('gungong-phone') ? 'phone' : 'account';

      // ส่งข้อมูลไป background script เพื่อเช็คกับ API
      chrome.runtime.sendMessage({
        type: 'CHECK_DATA',
        data: { value, type }
      });
    });
  });
}

/**
 * สร้าง context menu สำหรับข้อความที่เลือก
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SCAN_PAGE') {
    scanPageContent();
    sendResponse({ success: true });
  } else if (request.type === 'SCAN_SELECTION') {
    const selection = window.getSelection().toString();
    if (selection) {
      const phones = extractPhoneNumbers(selection);
      const accounts = extractBankAccounts(selection);
      sendResponse({ phones, accounts, text: selection });
    } else {
      sendResponse({ phones: [], accounts: [], text: '' });
    }
  }
  return true; // Keep message channel open for async response
});

// สแกนหน้าเว็บอัตโนมัติเมื่อโหลดเสร็จ
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scanPageContent);
} else {
  scanPageContent();
}

// ฟังการเปลี่ยนแปลง DOM (สำหรับ SPA)
const observer = new MutationObserver((mutations) => {
  // Debounce: สแกนใหม่หลังจาก DOM หยุดเปลี่ยนแปลง 1 วินาที
  clearTimeout(observer.scanTimeout);
  observer.scanTimeout = setTimeout(scanPageContent, 1000);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('GunGong Extension: Content script loaded');
