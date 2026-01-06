// ==================== Servi message ==================== //










// ==================== PDPA Function ==================== //
document.addEventListener("DOMContentLoaded", () => {
  checkPDPAStatus();

  const scrollArea = document.querySelector('.pdpa-scroll-area');
  if (scrollArea) {

    scrollArea.addEventListener('scroll', checkScrollPosition);
    if (scrollArea.scrollHeight <= scrollArea.clientHeight) {
      unlockCheckbox();
    }
  }
});

function checkPDPAStatus() {
  const isAccepted = localStorage.getItem('gungong_pdpa_accepted');
  if (!isAccepted) {
    const modal = document.getElementById('pdpa-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }
}

function checkScrollPosition() {
  const scrollArea = document.querySelector('.pdpa-scroll-area');
  if (scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 5) {
    unlockCheckbox();
  }
}

function unlockCheckbox() {
  const checkbox = document.getElementById('pdpa-checkbox');
  const label = document.getElementById('pdpa-label');

  if (checkbox.disabled) {
    checkbox.disabled = false;
    label.style.opacity = '1';
    label.style.cursor = 'pointer';
    label.style.color = '#333';
  }
}

function togglePdpaButton() {
  const checkbox = document.getElementById('pdpa-checkbox');
  const btn = document.getElementById('pdpa-btn');
  btn.disabled = !checkbox.checked;
}

function acceptPDPA() {
  localStorage.setItem('gungong_pdpa_accepted', 'true');
  const modal = document.getElementById('pdpa-modal');
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
  document.body.style.overflow = '';
}

// =================== BANNER SLIDER Function =================== //
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('banner-slider');
  const paginationContainer = document.getElementById('banner-pagination');
  if (!slider || !paginationContainer) return;
  const slides = slider.querySelectorAll('.banner-slide');
  const totalSlides = slides.length;
  let autoPlayInterval;
  const slideDelay = 5000;

  paginationContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;

    dot.addEventListener('click', () => {
      scrollToSlide(i);
      resetAutoPlay();
    });

    paginationContainer.appendChild(dot);
  }

  const dots = paginationContainer.querySelectorAll('.dot');
  function scrollToSlide(index) {
    const slideWidth = slider.offsetWidth;
    slider.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth'
    });
  }

  slider.addEventListener('scroll', () => {
    const scrollLeft = slider.scrollLeft;
    const width = slider.offsetWidth;
    const activeIndex = Math.round(scrollLeft / width);
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  });

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      const scrollLeft = slider.scrollLeft;
      const width = slider.offsetWidth;
      const currentIndex = Math.round(scrollLeft / width);
      let nextIndex = currentIndex + 1;
      if (nextIndex >= totalSlides) {
        nextIndex = 0;
      }
      scrollToSlide(nextIndex);
    }, slideDelay);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  startAutoPlay();

  slider.addEventListener('touchstart', stopAutoPlay);
  slider.addEventListener('touchend', startAutoPlay);
  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);
});

//----------------- Main Navigation Function -----------------//
function showSection(sectionId) {
  window.scrollTo(0, 0);
  const mainContainer = document.querySelector('main');
  if (mainContainer) {
    if (sectionId === 'social-page') {
      mainContainer.classList.add('main-expanded');
    }
    else { mainContainer.classList.remove('main-expanded'); }
  }

  const userInfo = document.querySelector('.user-info');
  if (userInfo) {
    if (sectionId === 'social-page') {
      userInfo.classList.add('slide-down');
    }
    else { userInfo.classList.remove('slide-down'); }
  }

  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.classList.remove("active");
    section.style.display = "";
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  const navItems = document.querySelectorAll(".nav-item, .scanner-btn");
  navItems.forEach((item) => item.classList.remove("active"));

  const activeNav = document.querySelector(`[data-section="${sectionId}"]`);
  if (activeNav) {
    activeNav.classList.add("active");
  } else if (sectionId !== "home-page" && sectionId !== "history-page") {
    const scannerBtn = document.querySelector(".scanner-btn");
    if (scannerBtn) scannerBtn.classList.add("active");
  }
}

//----------------- Event Listeners -----------------//
document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll("[data-section]");

  navButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = button.getAttribute("data-section");
      showSection(sectionId);
    });
  });
});

//----------------- Scanner Feature Function -----------------//
function openFeature(featureName) {
  const targetId = featureName + "-page";
  showSection(targetId);

  if (featureName === "scan-qr") {
    setTimeout(() => {
      scanCode();
    }, 500);
  }
}

//----------------- Clear text Function -----------------//
function clearInput(inputId) {
  const inputField = document.getElementById(inputId);
  if (inputField) {
    inputField.value = "";
  }
}

//----------------- Fix Keyboard Issue (Mobile) -----------------//
const inputs = document.querySelectorAll("input, textarea");
const bottomNav = document.querySelector(".bottom-nav");
const floatBtn = document.querySelector(".floating-line-btn");

inputs.forEach((input) => {
  if (input.type === 'checkbox' || input.type === 'radio') return;

  input.addEventListener("focus", () => {
    if (bottomNav) bottomNav.style.display = "none";
    if (floatBtn) floatBtn.style.display = "none";
  });

  input.addEventListener("blur", () => {
    setTimeout(() => {
      if (bottomNav) bottomNav.style.display = "flex";
      if (floatBtn) floatBtn.style.display = "flex";
    }, 200);
  });
});

//----------------- LINE OA Button Confirmation -----------------//
document.addEventListener("DOMContentLoaded", () => {
  const lineBtn = document.querySelector(".line-oa-header-btn");

  if (lineBtn) {
    lineBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const targetUrl = this.getAttribute("href");

      Swal.fire({
        title: "เปิด LINE Official",
        text: "ต้องการไปที่หน้าแชท GunGong หรือไม่",
        imageUrl: "img/logo.png",
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: "GunGong Logo",
        showCancelButton: true,
        confirmButtonColor: "#8ef168",
        cancelButtonColor: "#fa9292ff",
        confirmButtonText: "ใช่",
        cancelButtonText: "ยกเลิก",
        background: "#fff",
        borderRadius: "20px",
      }).then((result) => {
        if (result.isConfirmed) {
          window.open(targetUrl, "_blank");
        }
      });
    });
  }
});

// ==================== VERIFY PAGE FUNCTIONS==================== //
function switchCard(level) {
  const levels = ['silver', 'gold', 'diamond'];
  const index = levels.indexOf(level);

  if (index === -1) return;

  document.querySelectorAll('.badge-level').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`btn-${level}`).classList.add('active');

  const cardSlider = document.getElementById('verify-card-slider');
  if (cardSlider) {
    const slideWidth = cardSlider.clientWidth;
    cardSlider.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth'
    });
  }

  const menuSlider = document.getElementById('verify-menu-slider');
  if (menuSlider) {
    const slideWidth = menuSlider.clientWidth;
    menuSlider.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth'
    });
  }
}

function updateUI(profile) {
  document.querySelectorAll('.card-user-name').forEach(el => {
    el.innerText = profile.displayName || 'Guest';
  });

  document.querySelectorAll('.card-user-id').forEach(el => {
    el.innerText = 'User ID : ' + (profile.userId || '-');
  });

  document.querySelectorAll('.card-avatar.user-avatar-img').forEach(img => {
    img.src = profile.pictureUrl || 'https://vos.line-scdn.net/imgs/apis/ic_mini.png';
  });
}

// ==================== SOCIAL PAGE FUNCTIONS ==================== //

function toggleSocialPopup() {
  const popup = document.getElementById('social-popup-menu');
  if (popup) {
    popup.classList.toggle('active');
  }
}

// ปิด Popup เมื่อกดที่อื่นบนหน้าจอ
document.addEventListener('click', function (event) {
  const popup = document.getElementById('social-popup-menu');
  const addBtnWrapper = document.querySelector('.add-btn-wrapper');

  // ถ้าคลิกนอกปุ่มและนอก popup ให้ปิด popup
  if (popup && popup.classList.contains('active') && !addBtnWrapper.contains(event.target)) {
    popup.classList.remove('active');
  }
});

// ฟังก์ชัน handlePostAction เดิม (แก้แค่บรรทัดแรกให้เรียกปิด Popup ใหม่)
function handlePostAction(type) {
  toggleSocialPopup(); // ปิดเมนู

  if (type === 'image') {
    Swal.fire({
      icon: 'info',
      title: 'อัปโหลดรูปภาพ',
      text: 'ระบบกำลังเปิดแกลเลอรี่...',
      showConfirmButton: false,
      timer: 1500,
      borderRadius: '20px'
    });
  } else if (type === 'link') {
    Swal.fire({
      input: 'url',
      inputLabel: 'วางลิงก์ที่ต้องการแชร์',
      inputPlaceholder: 'https://...',
      showCancelButton: true,
      confirmButtonText: 'โพสต์',
      confirmButtonColor: '#3ACE00',
      cancelButtonText: 'ยกเลิก',
      borderRadius: '20px'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('โพสต์สำเร็จ!', 'ลิงก์ของคุณถูกแชร์แล้ว', 'success');
      }
    });
  }
}

// ==================== BANK SELECTOR LOGIC ==================== //
const banks = [
  { code: "KBANK", name: "กสิกรไทย (KBANK)", color: "#138f2d" },
  { code: "SCB", name: "ไทยพาณิชย์ (SCB)", color: "#4e2e7f" },
  { code: "BBL", name: "กรุงเทพ (BBL)", color: "#1e4598" },
  { code: "KTB", name: "กรุงไทย (KTB)", color: "#1ba5e1" },
  { code: "BAY", name: "กรุงศรี (BAY)", color: "#fec43b" },
  { code: "TTB", name: "ทหารไทยธนชาต (TTB)", color: "#1279be" },
  { code: "BAAC", name: "ธ.ก.ส. (BAAC)", color: "#4b9b1d" },
  { code: "GSB", name: "ออมสิน (GSB)", color: "#eb198d" },
];

function initBankSelector() {
  const listContainer = document.getElementById("bank-options-list");
  if (!listContainer) return;
  listContainer.innerHTML = "";
  banks.forEach((bank) => {
    const item = document.createElement("div");
    item.className = "bank-option-item";

    const imgUrl = `img/banks/${bank.code}.png`;
    item.innerHTML = `
      <img src="${imgUrl}" alt="${bank.name}">
      <span>${bank.name}</span>
    `;
    item.onclick = () => selectBank(bank, imgUrl);
    listContainer.appendChild(item);
  });
}

function selectBank(bank, imgUrl) {
  const nameElem = document.getElementById("selected-bank-name");
  const imgElem = document.getElementById("selected-bank-img");

  nameElem.innerText = bank.name;
  nameElem.classList.remove("placeholder-text");

  imgElem.src = imgUrl;
  imgElem.classList.remove("hidden");

  document.getElementById("selected-bank-code").value = bank.code;
  document.getElementById("bank-select-wrapper").classList.remove("active");
}

function toggleBankDropdown() {
  const wrapper = document.getElementById("bank-select-wrapper");
  if (wrapper) {
    wrapper.classList.toggle("active");
  }
}

document.addEventListener("click", (e) => {
  const wrapper = document.getElementById("bank-select-wrapper");
  if (wrapper && !wrapper.contains(e.target)) {
    wrapper.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initBankSelector();
});

// ==================== API INTEGRATION ==================== //
// Auto-detect API URL based on environment
// Priority:
// 1. Same origin (if backend serves frontend)
// 2. localhost:8000 (local development)
// 3. Environment variable (if available)

function getApiBaseUrl() {
  // Check if running in file:// protocol (local HTML file)
  if (window.location.protocol === "file:") {
    return "http://localhost:8000";
  }

  // Check if running on localhost
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:8000";
  }

  // Production: Use same origin (backend serves frontend)
  // This works when FastAPI serves the static files
  return window.location.origin;
}

const API_BASE_URL = getApiBaseUrl();
console.log("🔗 API Base URL:", API_BASE_URL);

// Helper to get User ID
async function getUserId() {
  if (typeof liff !== "undefined" && (liff.isInClient() || liff.isLoggedIn())) {
    try {
      const profile = await liff.getProfile();
      return profile.userId;
    } catch (e) {
      console.warn("Error getting profile:", e);
    }
  }
  // Fallback for testing
  return localStorage.getItem("mock_user_id") || "U_MOCK_USER_ID";
}

async function callFraudCheckApi(message, type) {
  const apiUrl = `${API_BASE_URL}/check-fraud`;
  console.log(`Calling API: ${apiUrl}`);

  try {
    // Show loading
    Swal.fire({
      title: "กำลังตรวจสอบ...",
      text: "AI กำลังวิเคราะห์ข้อมูล",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const userId = await getUserId();
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ message: message, user_id: userId }),
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `Server Error (${response.status})`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        // If can't parse JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    showResult(data, type);
  } catch (error) {
    console.error("API Error:", error);

    // User-friendly error messages
    let userMessage = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
    let suggestion = "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต";

    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      userMessage = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์";
      suggestion = "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง";
    } else if (error.message.includes("500")) {
      userMessage = "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์";
      suggestion = "กรุณาลองใหม่อีกครั้งในอีกสักครู่";
    } else if (error.message.includes("503")) {
      userMessage = "บริการไม่พร้อมใช้งานชั่วคราว";
      suggestion = "เซิร์ฟเวอร์กำลังบำรุงรักษา กรุณาลองใหม่ในภายหลัง";
    } else if (error.message.includes("timeout") || error.message.includes("408")) {
      userMessage = "การเชื่อมต่อหมดเวลา";
      suggestion = "ข้อความของคุณอาจยาวเกินไป กรุณาลองข้อความสั้นกว่านี้";
    }

    Swal.fire({
      icon: "error",
      title: userMessage,
      text: suggestion,
      footer: settings.debug ? `<small>Technical: ${error.message}</small>` : '<small>หากปัญหายังคงอยู่ กรุณาติดต่อเจ้าหน้าที่</small>',
      confirmButtonText: "ลองอีกครั้ง",
      confirmButtonColor: "#d33",
      borderRadius: "20px",
    });
  }
}

function showResult(data, type) {
  const isFraud = data.is_fraud;
  const isSafe = data.is_safe;
  const riskLevel = data.risk_level || (isFraud ? "High" : "Low");
  const confidence = data.confidence_score || 0;

  let title = isSafe ? "ปลอดภัย ✅" : "อันตราย! ⚠️";
  let icon = isSafe ? "success" : "warning";
  let color = isSafe ? "#3ACE00" : "#FF453A";

  if (isFraud) {
    title = "ตรวจพบความเสี่ยง! 🚨";
    icon = "error";
  }

  let htmlContent = `
    <div style="text-align: left; font-size: 14px;">
      <p><b>ผลการวิเคราะห์:</b> ${data.category || "N/A"}</p>
      <p><b>ความเสี่ยง:</b> <span style="color: ${color}; font-weight: bold;">${riskLevel}</span></p>
      <p><b>ความมั่นใจ:</b> ${confidence}%</p>
      ${data.reason_th ? `<p><b>เหตุผล:</b> ${data.reason_th}</p>` : ""}
      ${data.reasoning_summary
      ? `<p><b>AI Note:</b> ${data.reasoning_summary}</p>`
      : ""
    }
    </div>
  `;

  Swal.fire({
    title: title,
    html: htmlContent,
    icon: icon,
    confirmButtonText: "ตกลง",
    confirmButtonColor: color,
    borderRadius: "20px",

    // [เพิ่ม] พอกดตกลง ให้โหลดประวัติใหม่ทันที
    didClose: () => {
      // ถ้าอยู่หน้า History ให้โหลดใหม่
      const historyPage = document.getElementById("history-page");
      if (historyPage && historyPage.classList.contains("active")) {
        loadHistory();
      } else {
        // หรือเคลียร์ตัวแปรเพื่อให้โหลดใหม่ครั้งหน้า
        allHistoryEntries = [];
      }
    },
  });
}

// ==================== FEATURE FUNCTIONS ==================== //

function checkLink() {
  const input = document.getElementById("link-input");
  const url = input.value.trim();

  if (!url) {
    Swal.fire({
      icon: "warning",
      title: "กรุณากรอกลิงก์",
      text: "ช่องว่างห้ามเว้นว่าง",
      confirmButtonColor: "#fec43b",
      borderRadius: "20px",
    });
    return;
  }

  callFraudCheckApi(url, "link");
}

function checkSMS() {
  const input = document.getElementById("sms-input");
  const text = input.value.trim();

  if (!text) {
    Swal.fire({
      icon: "warning",
      title: "กรุณากรอกข้อความ",
      text: "ช่องว่างห้ามเว้นว่าง",
      confirmButtonColor: "#fec43b",
      borderRadius: "20px",
    });
    return;
  }

  callFraudCheckApi(text, "sms");
}

async function scanCode() {
  // Check if LIFF is initialized
  if (!liff.isInClient() && !liff.isLoggedIn()) {
    // For testing in browser without LIFF
    const { value: text } = await Swal.fire({
      title: "Simulation Mode",
      input: "text",
      inputLabel: "Enter QR Code content (Simulation)",
      inputPlaceholder: "https://example.com",
      showCancelButton: true,
    });

    if (text) {
      callFraudCheckApi(text, "qr");
    }
    return;
  }

  try {
    if (liff.scanCodeV2) {
      const result = await liff.scanCodeV2();
      if (result.value) {
        callFraudCheckApi(result.value, "qr");
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "ฟีเจอร์ไม่รองรับ",
        text: "กรุณาเปิดใน LINE Application เพื่อใช้งานสแกน QR",
        borderRadius: "20px",
      });
    }
  } catch (error) {
    console.error("Scan Error:", error);
    Swal.fire({
      icon: "error",
      title: "สแกนไม่สำเร็จ",
      text: error.message,
      borderRadius: "20px",
    });
  }
}

function checkBank() {
  const bankCode = document.getElementById("selected-bank-code").value;
  const accountNo = document.getElementById("bank-account-input").value.trim();

  if (!bankCode) {
    Swal.fire({
      icon: "warning",
      title: "กรุณาเลือกธนาคาร",
      confirmButtonColor: "#fec43b",
      borderRadius: "20px",
    });
    return;
  }

  if (!accountNo) {
    Swal.fire({
      icon: "warning",
      title: "กรุณากรอกเลขบัญชี",
      confirmButtonColor: "#fec43b",
      borderRadius: "20px",
    });
    return;
  }

  callBlacklistApi(
    "/check-bank",
    { bank_code: bankCode, account_number: accountNo },
    "bank"
  );
}

function checkPhone() {
  const phoneNo = document.getElementById("phone-input").value.trim();

  if (!phoneNo) {
    Swal.fire({
      icon: "warning",
      title: "กรุณากรอกเบอร์โทรศัพท์",
      confirmButtonColor: "#fec43b",
      borderRadius: "20px",
    });
    return;
  }

  callBlacklistApi("/check-phone", { phone_number: phoneNo }, "phone");
}

async function callBlacklistApi(endpoint, payload, type) {
  const apiUrl = `${API_BASE_URL}${endpoint}`;
  console.log(`Calling API: ${apiUrl}`);

  try {
    Swal.fire({
      title: "กำลังตรวจสอบ...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const userId = await getUserId();
    const payloadWithUser = { ...payload, user_id: userId };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadWithUser),
    });

    if (!response.ok) {
      throw new Error(
        `Server returned ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    showBlacklistResult(data, type);
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: error.message,
      confirmButtonColor: "#d33",
      borderRadius: "20px",
    });
  }
}

function showBlacklistResult(data, type) {
  const isBlacklisted = data.is_blacklisted;
  const details = data.details || {};

  if (isBlacklisted) {
    Swal.fire({
      icon: "error",
      title: "อันตราย! 🚨",
      html: `
        <div style="text-align: left;">
          <p><b>พบในบัญชีดำ:</b> ${details.category || "ไม่ระบุ"}</p>
          <p><b>ความเสี่ยง:</b> <span style="color: red; font-weight: bold;">${details.risk_level || "High"
        }</span></p>
          ${details.account_name
          ? `<p><b>ชื่อบัญชี:</b> ${details.account_name}</p>`
          : ""
        }
          ${details.owner_name
          ? `<p><b>ชื่อผู้จดทะเบียน:</b> ${details.owner_name}</p>`
          : ""
        }
          <p><b>จำนวนรายงาน:</b> ${details.report_count || 0} ครั้ง</p>
        </div>
      `,
      confirmButtonColor: "#d33",
      borderRadius: "20px",
      didClose: () => {
        const historyPage = document.getElementById("history-page");
        if (historyPage && historyPage.classList.contains("active")) {
          loadHistory();
        } else {
          allHistoryEntries = [];
        }
      },
    });
  } else {
    Swal.fire({
      icon: "success",
      title: "ไม่พบข้อมูลในบัญชีดำ ✅",
      text: "แต่ควรตรวจสอบให้แน่ใจก่อนโอนเงินทุกครั้ง",
      confirmButtonColor: "#3ACE00",
      borderRadius: "20px",
      didClose: () => {
        const historyPage = document.getElementById("history-page");
        if (historyPage && historyPage.classList.contains("active")) {
          loadHistory();
        } else {
          allHistoryEntries = [];
        }
      },
    });
  }
}

// ==================== HISTORY FEATURE ==================== //

let isHistoryExpanded = false;

let allHistoryEntries = [];
async function loadHistory() {
  const historyList = document.querySelector(".history-list");

  const seeMoreBtn = document.getElementById("history-see-more");

  if (!historyList) return;

  // โชว์ Loading

  historyList.innerHTML =
    '<div style="text-align:center; padding:20px; color:#aaa;">กำลังโหลดข้อมูล...</div>';

  if (seeMoreBtn) seeMoreBtn.style.display = "none";

  try {
    const userId = await getUserId();

    // สร้าง API URL (ไม่ส่ง user_id ถ้าเป็น null)
    let apiUrl = `${API_BASE_URL}/cache-entries?limit=50`;
    if (userId) {
      apiUrl += `&user_id=${userId}`;
    }

    const response = await fetch(apiUrl, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error (${response.status}): ${errorText || response.statusText}`);
    }

    const data = await response.json();

    allHistoryEntries = data.entries || []; // เก็บลงตัวแปรกลาง

    // เรียก Render

    renderHistoryList(allHistoryEntries);
  } catch (error) {
    console.error("Load history failed:", error);

    // User-friendly error message
    let errorTitle = "โหลดข้อมูลไม่สำเร็จ";
    let errorMessage = "กรุณาลองใหม่อีกครั้ง";

    if (error.message.includes("Failed to fetch")) {
      errorMessage = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
    } else if (error.message.includes("500")) {
      errorMessage = "เซิร์ฟเวอร์ขัดข้อง กรุณาลองใหม่ในอีกสักครู่";
    }

    historyList.innerHTML = `
      <div style="text-align:center; padding:40px 20px;">
        <div style="font-size:48px; margin-bottom:16px;">😔</div>
        <h3 style="color:#ff6b6b; margin-bottom:8px;">${errorTitle}</h3>
        <p style="font-size: 14px; color: #888; margin-bottom:20px;">${errorMessage}</p>
        <button onclick="loadHistory()" style="padding:12px 24px; background:#8ef168; color:#333; border:none; border-radius:25px; cursor:pointer; font-size:14px; font-weight:600; box-shadow: 0 2px 8px rgba(142,241,104,0.3);">
          🔄 ลองใหม่อีกครั้ง
        </button>
      </div>
    `;
  }
}

// ฟังก์ชัน Render รายการประวัติ
function renderHistoryList(entries) {
  const historyList = document.querySelector(".history-list");
  const seeMoreContainer = document.getElementById("history-see-more");
  historyList.innerHTML = "";

  if (entries.length === 0) {
    historyList.innerHTML =
      '<p style="text-align:center; color:#888; margin-top:20px;">ไม่พบประวัติการตรวจสอบ</p>';
    if (seeMoreContainer) seeMoreContainer.style.display = "none";
    return;
  }

  // Logic การตัดแบ่งข้อมูล (Pagination)
  const displayEntries = isHistoryExpanded ? entries : entries.slice(0, 3);

  // จัดการปุ่ม See More
  if (seeMoreContainer) {
    // ถ้าข้อมูลมีมากกว่า 3 และยังไม่ได้กดขยาย -> โชว์ปุ่ม
    if (entries.length > 3 && !isHistoryExpanded) {
      seeMoreContainer.style.display = "block";
    } else {
      seeMoreContainer.style.display = "none";
    }
  }

  displayEntries.forEach((entry) => {
    // 1. กำหนดค่าพื้นฐาน
    const isSafe = entry.is_safe;
    const isFraud = entry.is_fraud;
    const type = entry.type || "unknown";

    // 2. Map ไอคอนตามประเภท (5 แบบ) - แต่สีตามสถานะความปลอดภัย
    let typeName = "Unknown";
    let typeIcon = "";

    // กำหนดสีพื้นหลังตามความปลอดภัย
    let iconClass = "icon-unknown";
    if (isFraud) {
      iconClass = "icon-dangerous";
    } else if (isSafe) {
      iconClass = "icon-safe";
    }

    switch (type) {
      case "link":
        typeName = "Link";
        typeIcon =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
        break;
      case "message":
        typeName = "Message";
        typeIcon =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
        break;
      case "text":
        typeName = "Text";
        typeIcon =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
        break;
      case "sms":
        typeName = "SMS";
        typeIcon =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
        break;
      case "qr":
        typeName = "QrCode";
        typeIcon =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>';
        break;
      case "bank":
        typeName = "Bank";
        typeIcon =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>';
        break;
      case "phone":
        typeName = "Phone";
        typeIcon =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
        break;
      default:
        typeName = "Unknown";
        typeIcon =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>';
    }

    // 3. กำหนดสถานะ Safe / Dangerous
    let statusClass = "";
    let statusText = "";
    let statusIcon = "";

    if (isSafe) {
      statusClass = "safe"; // ใช้สำหรับ border
      statusText =
        '<div class="status-badge badge-safe"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg> SAFE</div>';
    } else {
      statusClass = "dangerous";
      statusText =
        '<div class="status-badge badge-dangerous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> DANGEROUS</div>';
    }

    // 4. เวลา
    let timeStr = "";
    if (entry.created_at) {
      const dateObj = new Date(entry.created_at);
      timeStr = dateObj.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // 5. สร้าง HTML
    const item = document.createElement("div");
    item.className = `history-card ${statusClass}`;

    item.innerHTML = `
      <div class="card-left-line"></div>
      <div class="h-card-content">
        <div class="h-card-top">
          <span class="type-label">Type : ${typeName}</span>
          <span class="timestamp">${timeStr}</span>
        </div>
        <div class="h-card-main">
          <div class="h-icon ${iconClass}">
            ${typeIcon}
          </div>
          <span class="main-text">${entry.message_text ||
      entry.account_number ||
      entry.phone_number ||
      "No content"
      }</span>
        </div>
        <div class="h-card-bottom">
          ${statusText}
          <button class="feedback-btn" onclick="event.stopPropagation(); showFeedbackModal(allHistoryEntries.find(e => e.id === '${entry.id}'))">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
               <circle cx="12" cy="12" r="10"></circle>
               <line x1="12" y1="8" x2="12" y2="12"></line>
               <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Report
          </button>
        </div>
      </div>
    `;

    item.onclick = () => {
      showHistoryDetail(entry, isSafe);
    };
    historyList.appendChild(item);
  });
}

// ==================== FEEDBACK SYSTEM ==================== //

function showFeedbackModal(entry) {
  Swal.fire({
    title: 'ต้องการรายงานผล?',
    text: 'หากผลการตรวจสอบไม่ถูกต้อง แจ้งเราได้เลย',
    icon: 'question',
    showDenyButton: true,
    showCancelButton: true,
    showConfirmButton: false, // Hide "Like" button
    confirmButtonText: null, // Ensure no text
    denyButtonText: 'รายงาน',
    cancelButtonText: 'ยกเลิก',
    denyButtonColor: '#FF453A',
  }).then((result) => {
    if (result.isDenied) {
      // Ask for reason
      Swal.fire({
        title: 'ขอทราบข้อมูลเพิ่มเติม',
        input: 'text',
        inputLabel: 'ทำไมถึงคิดว่าไม่ถูกต้อง?',
        inputPlaceholder: 'เช่น ข้อมลนี้ถูกต้อง',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((inputResult) => {
        if (inputResult.isConfirmed) {
          submitFeedback(entry.id, 'dislike', inputResult.value);
        }
      });
    }
  });
}

async function submitFeedback(historyId, feedbackType, comment = null) {
  const apiUrl = `${API_BASE_URL}/feedback`;

  try {
    const userId = await getUserId();

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        history_id: historyId,
        user_id: userId,
        feedback_type: feedbackType,
        comment: comment
      })
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'ขอบคุณสำหรับข้อมูล',
        text: 'เราได้รับรายงานของคุณแล้ว',
        timer: 1000,
        showConfirmButton: false
      });
    } else {
      throw new Error('Failed to submit feedback');
    }
  } catch (error) {
    console.error('Feedback Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'ส่งข้อมูลไม่สำเร็จ',
      text: 'กรุณาลองใหม่อีกครั้ง'
    });
  }
}

// ฟังก์ชันกดปุ่ม "ดูทั้งหมด"
function expandHistory() {
  isHistoryExpanded = true;
  // เรียก render ใหม่โดยใช้ข้อมูลเดิมที่กรองไว้แล้ว
  // (เราต้องเรียก runFilterLogic เพื่อให้มันกรองและส่งค่ามา render ใหม่)
  runFilterLogic();
}

// แยก Logic Popup รายละเอียดออกมา
// ในไฟล์ js/script.js

// แก้ไขฟังก์ชันแสดงรายละเอียดประวัติ
function showHistoryDetail(entry, isSafe, onClose) {
  // สร้างเนื้อหา HTML
  const contentHtml = `
    <div style="text-align: left; font-size: 14px; position: relative;">

      <button onclick="Swal.close()" style="
        top: -45px;      /* ดึงขึ้นไปให้พ้นเนื้อหา */
        right: -15px;    /* ดึงขวาไปให้ชิดมุม */
        background: none;
        border: none;
        font-size: 28px; /* เพิ่มขนาดให้กดง่าย */
        color: #999;
        cursor: pointer;
        z-index: 10;     /* ให้ลอยอยู่บนสุด */
        padding: 10px;">
      </button>

      <p><b>ข้อความ:</b> ${entry.full_message || entry.message_text}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
      <p><b>ผลวิเคราะห์:</b> ${entry.classification}</p>
      <p><b>ความมั่นใจ:</b> ${entry.confidence_score}%</p>
      ${entry.reason ? `<p><b>เหตุผล:</b> ${entry.reason}</p>` : ""}

      <button onclick="shareHistoryResult('${encodeURIComponent(JSON.stringify(entry))}')"
        style="
          width: 100%;
          margin-top: 20px;
          padding: 12px;
          background: #3ACE00;
          color: white;
          border: none;
          border-radius: 50px;
          font-family: 'Noto Sans Thai', sans-serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
          <polyline points="16 6 12 2 8 6"></polyline>
          <line x1="12" y1="2" x2="12" y2="15"></line>
        </svg>
        แชร์ผลลัพธ์
      </button>
    </div>
  `;

  Swal.fire({
    title: isSafe ? "ปลอดภัย ✅" : "อันตราย! ⚠️",
    html: contentHtml,
    icon: isSafe ? "success" : "warning",
    showConfirmButton: false, // ซ่อนปุ่ม OK เดิม
    showCloseButton: true,   // เราสร้างปุ่มปิดเองแล้ว
    borderRadius: "20px",
    customClass: {
      popup: 'history-detail-popup' // (Optional) เผื่ออยากแต่ง CSS เพิ่ม
    },
    didClose: () => {
      if (onClose) onClose();
    }
  });
}

// ฟังก์ชันสำหรับแชร์ผลลัพธ์ (เพิ่มต่อท้ายฟังก์ชัน showHistoryDetail)
async function shareHistoryResult(entryString) {
  // แปลง string กลับเป็น object
  const entry = JSON.parse(decodeURIComponent(entryString));

  if (!liff.isInClient()) {
    Swal.fire({
      icon: 'warning',
      title: 'ไม่สามารถแชร์ได้',
      text: 'ฟีเจอร์นี้ใช้งานได้เฉพาะบนแอป LINE เท่านั้น',
      borderRadius: '20px'
    });
    return;
  }

  // --- ✅ ส่วนที่เพิ่ม: ตัดข้อความถ้ายาวเกินไป ---
  let displayText = entry.full_message || entry.message_text || "-";
  const maxLength = 300; // กำหนดความยาวสูงสุด (แนะนำ 200-300 ตัวอักษร)

  if (displayText.length > maxLength) {
    // ตัดเหลือ 300 ตัวอักษร แล้วเติม ...
    displayText = displayText.substring(0, maxLength) + "...";
  }
  // -------------------------------------------

  // สร้าง Flex Message สำหรับผลลัพธ์
  const isSafe = entry.is_safe;

  // สีหลัก (เขียว/แดง)
  const themeColor = isSafe ? "#06C755" : "#FF334B";

  // สีพื้นหลังส่วนหัว (เขียวอ่อน/แดงอ่อน)
  const headerBgColor = isSafe ? "#D1FAE5" : "#FFE4E6";

  const statusText = isSafe ? "ปลอดภัย" : "อันตราย";
  const statusIconUrl = isSafe
    ? "https://cdn-icons-png.flaticon.com/512/14025/14025484.png" // รูปเครื่องหมายถูกสีเขียว
    : "https://cdn-icons-png.flaticon.com/512/14025/14025539.png"; // รูปตกใจสีแดง

  const flexMessage = {
    type: "flex",
    altText: `ผลการตรวจสอบ GunGong: ${statusText}`,
    contents: {
      type: "bubble",
      size: "kilo",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: headerBgColor,
        paddingAll: "20px",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "ผลการตรวจสอบ GunGong",
            weight: "bold",
            color: themeColor,
            size: "xs"
          },
          {
            type: "box",
            layout: "horizontal",
            spacing: "sm",
            alignItems: "center",
            contents: [
              {
                type: "image",
                url: statusIconUrl,
                size: "sm",
                flex: 0
              },
              {
                type: "text",
                text: statusText,
                weight: "bold",
                size: "3xl", // ขนาดใหญ่สะใจ
                color: themeColor,
                flex: 1
              }
            ]
          }
        ]
      },
      body: {
        type: "box",
        layout: "vertical",
        paddingAll: "20px",
        contents: [
          {
            type: "text",
            text: displayText, // ข้อความที่ตรวจสอบ (ตัดคำแล้ว)
            wrap: true,
            color: "#555555",
            size: "sm",
            maxLines: 5
          }
        ]
      },
      footer: {
        type: "box",
        layout: "vertical",
        paddingAll: "10px",
        contents: [
          {
            type: "button",
            action: {
              type: "uri",
              label: "ตรวจสอบด้วยตัวเอง",
              uri: "https://liff.line.me/2008548759-KkM4Noxa"
            },
            style: "primary",
            color: "#8ef168", // สีเขียวอ่อนของปุ่มตามธีมแอป
            height: "sm"
          }
        ]
      }
    }
  };

  try {
    if (liff.isApiAvailable("shareTargetPicker")) {
      const res = await liff.shareTargetPicker([flexMessage]);
      if (res) {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'แชร์เรียบร้อย',
          timer: 1500,
          showConfirmButton: false,
          borderRadius: '20px'
        });
      }
    }
  } catch (error) {
    console.error("Share Error:", error);
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถแชร์ได้ในขณะนี้',
      borderRadius: '20px'
    });
  }
}

// ==================== FILTER & SORT FUNCTION ==================== //

// [แก้ไข 1] เก็บ type เป็น Array เพื่อรองรับหลายค่า
let activeFilters = {
  type: ["all"],
  date: "all",
};

// 1. ฟังก์ชันปุ่มซ้าย: เลือกประเภท (Multi-Select)
function openTypeFilterModal() {
  const isChecked = (val) =>
    activeFilters.type.includes(val) ? "checked" : "";

  Swal.fire({
    title: "เลือกประเภทที่ต้องการ",
    html: `
      <div class="filter-options-container">

        <label class="filter-card-item">
          <input type="checkbox" value="link" ${isChecked("link")}>
          <div class="filter-card-content">
            <div class="filter-icon bg-blue">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            </div>
            <div class="filter-text">
              <h5>เช็คลิงก์</h5>
              <p>ตรวจสอบ / URL Domain</p>
            </div>
            <div class="check-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          </div>
        </label>

        <label class="filter-card-item">
          <input type="checkbox" value="sms" ${isChecked("sms")}>
          <div class="filter-card-content">
            <div class="filter-icon bg-purple">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <div class="filter-text">
              <h5>เช็คข้อความ</h5>
              <p>วิเคราะห์ Text Scam</p>
            </div>
            <div class="check-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          </div>
        </label>

        <label class="filter-card-item">
          <input type="checkbox" value="qr" ${isChecked("qr")}>
          <div class="filter-card-content">
            <div class="filter-icon bg-green">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </div>
            <div class="filter-text">
              <h5>สแกน QR Code</h5>
              <p>เช็ค Payment QR</p>
            </div>
            <div class="check-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          </div>
        </label>

        <label class="filter-card-item">
          <input type="checkbox" value="bank" ${isChecked("bank")}>
          <div class="filter-card-content">
            <div class="filter-icon bg-orange">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            </div>
            <div class="filter-text">
              <h5>เช็คเลขบัญชี</h5>
              <p>ค้นหา Blacklist</p>
            </div>
            <div class="check-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          </div>
        </label>

        <label class="filter-card-item">
          <input type="checkbox" value="phone" ${isChecked("phone")}>
          <div class="filter-card-content">
            <div class="filter-icon bg-red">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <div class="filter-text">
              <h5>เช็คเบอร์โทร</h5>
              <p>ค้นหา Call Center</p>
            </div>
            <div class="check-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          </div>
        </label>

      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "เลือกทั้งหมด",
    confirmButtonColor: "#3ACE00",
    cancelButtonColor: "#aaa", // สีเทาอ่อนลง
    borderRadius: "20px",
    preConfirm: () => {
      const checkboxes = document.querySelectorAll(
        '.filter-card-item input[type="checkbox"]:checked'
      );
      const selected = Array.from(checkboxes).map((cb) => cb.value);
      return selected.length > 0 ? selected : ["all"];
    },
  }).then((result) => {
    if (result.isConfirmed) {
      activeFilters.type = result.value;
      runFilterLogic();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      activeFilters.type = ["all"];
      runFilterLogic();
    }
  });
}

// 2. ฟังก์ชันปุ่มขวา: เลือกวันเวลา (เหมือนเดิม)
function openDateFilterModal() {
  Swal.fire({
    title: "เลือกช่วงเวลา",
    html: `
      <div class="filter-container" style="text-align: left;">
        <label class="filter-label">ช่วงเวลา</label>
        <select id="swal-filter-date" class="swal2-input custom-select">
          <option value="all" ${activeFilters.date === "all" ? "selected" : ""
      }>ทั้งหมด</option>
          <option value="today" ${activeFilters.date === "today" ? "selected" : ""
      }>วันนี้</option>
          <option value="yesterday" ${activeFilters.date === "yesterday" ? "selected" : ""
      }>เมื่อวาน</option>
          <option value="week" ${activeFilters.date === "week" ? "selected" : ""
      }>7 วันล่าสุด</option>
        </select>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "รีเซ็ตเวลา",
    confirmButtonColor: "#8ef168",
    cancelButtonColor: "#fa9292ff",
    borderRadius: "20px",
    preConfirm: () => document.getElementById("swal-filter-date").value,
  }).then((result) => {
    if (result.isConfirmed) {
      activeFilters.date = result.value;
      runFilterLogic();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      activeFilters.date = "all";
      runFilterLogic();
    }
  });
}

// 3. Logic การกรอง (อัปเดตใหม่รองรับ Array)
function runFilterLogic() {
  const selectedTypes = activeFilters.type;
  const dateRange = activeFilters.date;

  // จัดการจุดแดง (เหมือนเดิม)
  const filterDot = document.getElementById("filter-dot");
  if (filterDot)
    filterDot.style.display = !selectedTypes.includes("all") ? "block" : "none";
  const sortDot = document.getElementById("sort-dot");
  if (sortDot) sortDot.style.display = dateRange !== "all" ? "block" : "none";

  // กรองข้อมูล
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const filtered = allHistoryEntries.filter((entry) => {
    let typeMatch = false;
    if (selectedTypes.includes("all")) {
      typeMatch = true;
    } else {
      typeMatch = selectedTypes.includes(entry.type);
    }

    let dateMatch = dateRange === "all";
    if (!dateMatch && entry.created_at) {
      const entryDate = new Date(entry.created_at);
      if (dateRange === "today") {
        dateMatch = entryDate >= startOfDay;
      } else if (dateRange === "yesterday") {
        const yesterday = new Date(startOfDay);
        yesterday.setDate(yesterday.getDate() - 1);
        const endOfYesterday = new Date(startOfDay);
        dateMatch = entryDate >= yesterday && entryDate < endOfYesterday;
      } else if (dateRange === "week") {
        const lastWeek = new Date(startOfDay);
        lastWeek.setDate(lastWeek.getDate() - 7);
        dateMatch = entryDate >= lastWeek;
      }
    }
    return typeMatch && dateMatch;
  });

  renderHistoryList(filtered);
}

const originalShowSection = showSection;
showSection = function (sectionId) {
  originalShowSection(sectionId);
  if (sectionId === "history-page") {
    isHistoryExpanded = false;
    loadHistory();
  }
};
// ==================== DEEP LINK HANDLING ==================== //

async function getHistoryById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/history/${id}`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch history entry: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching history by ID:", error);
    return null;
  }
}

async function handleDeepLink() {
  const urlParams = new URLSearchParams(window.location.search);
  const historyId = urlParams.get("historyId");

  if (historyId) {
    console.log("🔗 Deep link detected for historyId:", historyId);

    // 1. Show loading state (Main content is hidden by CSS)
    Swal.fire({
      title: 'กำลังโหลดข้อมูล...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // 2. Fetch data
    const entry = await getHistoryById(historyId);

    // 3. Close loading
    Swal.close();

    if (entry) {
      // 4. Show detail popup
      const isSafe = entry.is_safe;
      showHistoryDetail(entry, isSafe, () => {
        // 5. On Close: Restore UI
        document.documentElement.classList.remove('deep-link-mode');
        showSection("history-page");
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'ไม่พบข้อมูล',
        text: 'ไม่พบประวัติการตรวจสอบที่คุณต้องการ',
        didClose: () => {
          document.documentElement.classList.remove('deep-link-mode');
          showSection("history-page");
        }
      });
    }
  }
}

// Call on load
document.addEventListener("DOMContentLoaded", () => {
  handleDeepLink();
});
