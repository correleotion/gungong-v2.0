// Regular Expressions for detecting phone numbers and bank accounts

/**
 * Thai phone number patterns
 * Supports formats: 0812345678, 08-1234-5678, 081-234-5678, etc.
 */
const PHONE_PATTERNS = [
  // Thai mobile (08x, 09x, 06x)
  /\b0[6-9]\d{1}[-\s]?\d{3}[-\s]?\d{4}\b/g,
  // International format
  /\b\+66[-\s]?[6-9]\d{1}[-\s]?\d{3}[-\s]?\d{4}\b/g,
  // Simple 10-digit
  /\b0[6-9]\d{8}\b/g
];

/**
 * Bank account patterns
 * Thai bank accounts typically 10-12 digits
 */
const BANK_ACCOUNT_PATTERNS = [
  // 10-12 digit bank accounts
  /\b\d{3}[-\s]?\d{1}[-\s]?\d{5}[-\s]?\d{1}\b/g, // xxx-x-xxxxx-x format
  /\b\d{3}[-\s]?\d{6}[-\s]?\d{1}\b/g, // xxx-xxxxxx-x format
  /\b\d{10,12}\b/g // Simple 10-12 digits
];

/**
 * Known Thai bank codes and names
 */
const THAI_BANKS = {
  'BBL': 'ธนาคารกรุงเทพ',
  'KBANK': 'ธนาคารกสิกรไทย',
  'KTB': 'ธนาคารกรุงไทย',
  'TTB': 'ธนาคารทหารไทยธนชาต',
  'SCB': 'ธนาคารไทยพาณิชย์',
  'BAY': 'ธนาคารกรุงศรีอยุธยา',
  'GSB': 'ธนาคารออมสิน',
  'BAAC': 'ธนาคาร ธ.ก.ส.',
  'CIMB': 'ธนาคาร CIMB',
  'TISCO': 'ธนาคารทิสโก้',
  'KKP': 'ธนาคารเกียรตินาคินภัทร',
  'ICBC': 'ธนาคาร ICBC',
  'TMBTHANACHART': 'ธนาคารทหารไทยธนชาต',
  'LH': 'ธนาคารแลนด์ แอนด์ เฮ้าส์'
};

/**
 * สแกนหาหมายเลขโทรศัพท์ในข้อความ
 * @param {string} text - ข้อความที่ต้องการสแกน
 * @returns {Array<string>} - รายการหมายเลขโทรศัพท์
 */
function extractPhoneNumbers(text) {
  const phones = new Set();

  PHONE_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // ทำความสะอาดและ normalize
        const cleaned = match.replace(/[-\s+]/g, '');
        // แปลง +66 เป็น 0
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
 * @param {string} text - ข้อความที่ต้องการสแกน
 * @returns {Array<string>} - รายการเลขบัญชีธนาคาร
 */
function extractBankAccounts(text) {
  const accounts = new Set();

  BANK_ACCOUNT_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // ทำความสะอาดและ normalize
        const cleaned = match.replace(/[-\s]/g, '');
        // ตรวจสอบว่าเป็นเลขบัญชีที่เป็นไปได้ (10-12 หลัก)
        if (cleaned.length >= 10 && cleaned.length <= 12 && /^\d+$/.test(cleaned)) {
          // กรองเลขที่เป็นเบอร์โทรออก
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
 * ตรวจจับชื่อธนาคารในข้อความ
 * @param {string} text - ข้อความที่ต้องการสแกน
 * @returns {Array<string>} - รายการชื่อธนาคาร
 */
function detectBankNames(text) {
  const detected = [];

  Object.entries(THAI_BANKS).forEach(([code, name]) => {
    if (text.includes(code) || text.includes(name)) {
      detected.push({ code, name });
    }
  });

  return detected;
}

/**
 * สแกนทั้งหมดในครั้งเดียว
 * @param {string} text - ข้อความที่ต้องการสแกน
 * @returns {Object} - ผลการสแกนทั้งหมด
 */
function scanAll(text) {
  return {
    phones: extractPhoneNumbers(text),
    accounts: extractBankAccounts(text),
    banks: detectBankNames(text),
    hasPhones: extractPhoneNumbers(text).length > 0,
    hasAccounts: extractBankAccounts(text).length > 0,
    hasBanks: detectBankNames(text).length > 0
  };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    extractPhoneNumbers,
    extractBankAccounts,
    detectBankNames,
    scanAll,
    THAI_BANKS
  };
}
