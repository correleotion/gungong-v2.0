// Developing : 2008548757-8a3lG2b5
// Published : 2008548759-KkM4Noxa

async function main() {
  const cached = localStorage.getItem('userProfile');
  cached && updateUI(JSON.parse(cached));
  await liff.init({ liffId: "2008548759-KkM4Noxa" });
  getUserProfile();
}

//---------------------- UserProfile ----------------------//
async function getUserProfile() {
  const profile = await liff.getProfile();

  localStorage.setItem('userProfile', JSON.stringify(profile));
  updateUI(profile);
}

function updateUI(profile) {
  const userPic = profile.pictureUrl || 'https://vos.line-scdn.net/imgs/apis/ic_mini.png';
  const userName = profile.displayName || 'Guest';
  const userIdText = 'User ID : ' + (profile.userId || '-');
  const statusHtml = 'Status : <span style="color: #3ACE00; font-weight: 700;">Active</span>';

  document.querySelectorAll('.avatar, .card-avatar').forEach(img => {
    img.src = userPic;
  });

  document.querySelectorAll('.user-name, .card-user-name').forEach(el => {
    el.innerText = userName;
  });

  document.querySelectorAll('.username-id').forEach(el => {
    el.innerHTML = statusHtml;
  });

  document.querySelectorAll('.card-user-id').forEach(el => {
    el.innerText = userIdText;
  });
}

//---------------------- Scan QRCode ----------------------//
async function scanCode() {
  try {
    const result = await liff.scanCodeV2();

    const resultContainer = document.getElementById('qr-result-container');
    const resultText = document.getElementById('qr-result');

    resultText.innerHTML = "<b>Code: </b>" + result.value;
    resultContainer.style.display = 'block';

  } catch (error) {
    console.log("Scan Error: ", error);
  }
}

//------------------- shareTargetPicker(Mini App) -------------------//
async function shareMiniApp() {
  if (!liff.isInClient()) {
    Swal.fire({
      title: 'แจ้งเตือน',
      text: 'ฟีเจอร์นี้ใช้งานได้เฉพาะบนแอป LINE เท่านั้น',
      imageUrl: 'img/error.png',
      imageWidth: 125,
      imageHeight: 125,
      imageAlt: 'Warning Icon',
      showConfirmButton: true,
      confirmButtonText: 'ปิด',
      confirmButtonColor: '#fa9292ff',
      showCancelButton: false,
      borderRadius: '0px',
      didOpen: () => {
        const popup = Swal.getPopup();
        const image = popup.querySelector('.swal2-image');
        const title = popup.querySelector('.swal2-title');
        const content = popup.querySelector('.swal2-html-container');
        const actions = popup.querySelector('.swal2-actions');
        if (image) {
          image.style.marginBottom = '-5px';
          image.style.borderRadius = '0px';
        }
        if (title) title.style.marginBottom = '0px';
        if (content) content.style.marginTop = '0px';
        if (actions) actions.style.marginTop = '10px';
      }
    });
    return;
  }

  const message = [
    {
      type: "flex",
      altText: "ลองใช้ GunGong สิ! ช่วยเช็คโจรและมิจฉาชีพได้แม่นยำ",
      contents: {
        type: "bubble",
        hero: {
          type: "image",
          url: "https://gungong-143631414136.asia-southeast1.run.app/img/mascot1.png",
          size: "full",
          aspectRatio: "20:13",
          aspectMode: "cover"
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "GunGong (กันโกง)",
              weight: "bold",
              size: "xl",
              color: "#3ACE00"
            },
            {
              type: "text",
              text: "แอปช่วยตรวจสอบลิงก์, SMS และบัญชีธนาคาร ป้องกันภัยออนไลน์ได้ทันที!",
              wrap: true,
              size: "sm",
              color: "#666666",
              margin: "md"
            }
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              action: {
                type: "uri",
                label: "ลองใช้งานเลย",
                uri: "https://liff.line.me/2008548759-KkM4Noxa"
              },
              style: "primary",
              color: "#3ACE00"
            }
          ]
        }
      }
    }
  ];

  try {
    if (liff.isApiAvailable("shareTargetPicker")) {
      const res = await liff.shareTargetPicker(message);
      if (res) {
        Swal.fire('สำเร็จ', 'แชร์ให้เพื่อนเรียบร้อยแล้ว!', 'success');
      }
    } else {
      Swal.fire('Error', 'อุปกรณ์หรือไลน์เวอร์ชันนี้ไม่รองรับการแชร์', 'error');
    }
  } catch (error) {
    console.error("Share Target Picker failed", error);
  }
}

//----------------- shareTargetPicker(Verify Card) -----------------//
async function shareVerificationCard() {
  if (!liff.isInClient()) {
    Swal.fire({
      title: 'แจ้งเตือน',
      text: 'ฟีเจอร์นี้ใช้งานได้เฉพาะบนแอป LINE เท่านั้น',
      imageUrl: 'img/error.png',
      imageWidth: 125,
      imageHeight: 125,
      imageAlt: 'Warning Icon',
      showConfirmButton: true,
      confirmButtonText: 'ปิด',
      confirmButtonColor: '#fa9292ff',
      borderRadius: '20px'
    });
    return;
  }

  const cached = localStorage.getItem('userProfile');
  const profile = cached ? JSON.parse(cached) : { displayName: 'Guest', userId: '-', pictureUrl: 'https://vos.line-scdn.net/imgs/apis/ic_mini.png' };

  let currentLevel = 'silver';
  const activeBtn = document.querySelector('.badge-level.active');
  if (activeBtn) {
    if (activeBtn.id.includes('gold')) currentLevel = 'gold';
    else if (activeBtn.id.includes('diamond')) currentLevel = 'diamond';
  }

  // 3. ตั้งค่าสีและรูปภาพ (แก้ชื่อไฟล์ตรงนี้)
  const baseUrl = "https://gungong-143631414136.asia-southeast1.run.app/img";

  const cardConfig = {
    silver: {
      title: 'SILVER',
      color: '#696969',
      // เปลี่ยนชื่อไฟล์เป็น _ และลบ %20 ออก
      bgUrl: `${baseUrl}/silver_card.png`
    },
    gold: {
      title: 'GOLD',
      color: '#8a6d3b',
      bgUrl: `${baseUrl}/gold_card.png`
    },
    diamond: {
      title: 'DIAMOND',
      color: '#5286e0',
      // แก้คำผิด dimond -> diamond และใส่ _
      bgUrl: `${baseUrl}/diamond_card.png`
    }
  };

  const config = cardConfig[currentLevel];

  // 4. สร้าง Flex Message (จำลองหน้าตาการ์ด)
  const flexMessage = {
    type: "flex",
    altText: `บัตรประจำตัว GunGong: ${profile.displayName}`,
    contents: {
      type: "bubble",
      size: "giga",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "image",
            url: config.bgUrl,
            size: "full",
            aspectMode: "cover",
            aspectRatio: "1.91:1",
            gravity: "center"
          },
          {
            type: "box",
            layout: "horizontal",
            position: "absolute",
            offsetAll: "0px",
            contents: [
              {
                type: "box",
                layout: "vertical",
                flex: 6,
                paddingAll: "20px",
                justifyContent: "space-between",
                contents: [
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        type: "box",
                        layout: "vertical",
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#ffffff",
                        cornerRadius: "20px",
                        justifyContent: "center",
                        alignItems: "center",
                        contents: [
                          { type: "icon", url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/shield.png", size: "20px" }
                        ]
                      },
                      {
                        type: "box",
                        layout: "vertical",
                        paddingStart: "10px",
                        contents: [
                          {
                            type: "text",
                            text: "ระดับการยืนยัน",
                            size: "xxs",
                            color: config.color,
                            weight: "bold"
                          },
                          {
                            type: "text",
                            text: config.title,
                            size: "xl",
                            weight: "900",
                            color: config.color
                          }
                        ]
                      }
                    ],
                    alignItems: "center"
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "text",
                        text: profile.displayName,
                        weight: "bold",
                        size: "lg",
                        color: config.color,
                        wrap: true
                      },
                      {
                        type: "text",
                        text: `User ID : ${profile.userId.substring(0, 8)}...`,
                        size: "xxs",
                        color: config.color
                      }
                    ]
                  }
                ]
              },
              {
                type: "box",
                layout: "vertical",
                flex: 3,
                alignItems: "center",
                justifyContent: "center",
                contents: [
                  {
                    type: "image",
                    url: profile.pictureUrl,
                    size: "70px",
                    aspectMode: "cover",
                    backgroundColor: "#ffffff",
                    cornerRadius: "100px"
                  }
                ]
              }
            ]
          }
        ],
        paddingAll: "0px",
        action: {
          type: "uri",
          label: "Open App",
          uri: "https://liff.line.me/2008548759-KkM4Noxa"
        }
      }
    }
  };

  try {
    if (liff.isApiAvailable("shareTargetPicker")) {
      const result = await liff.shareTargetPicker([flexMessage]);
      if (result) {
        Swal.fire({
          imageUrl: 'img/correct.png',
          imageWidth: 150,
          imageHeight: 150,
          title: 'แชร์สำเร็จ',
          text: 'ส่งบัตรประจำตัวเรียบร้อยแล้ว',
          confirmButtonText: 'OK',
          confirmButtonColor: '#8ef168',
          borderRadius: '20px',
          customClass: { popup: 'rounded-popup', confirmButton: 'rounded-btn' }
        });
      }
    } else {
      console.warn("TargetPicker not available");
    }
  } catch (error) {
    console.error("Share Error", error);
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถแชร์ข้อความได้',
      borderRadius: '20px'
    });
  }
}

main();



