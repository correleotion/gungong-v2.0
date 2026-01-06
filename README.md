# 🛡️ GunGong (กันโกง) - AI Fraud Detection Bot

LINE Bot ที่ใช้ Gemini AI และเทคโนโลยีหลายชั้นเพื่อตรวจจับข้อความฉ้อโกง Spam, Phishing และการหลอกลวง พร้อม LIFF Mini App สำหรับตรวจสอบลิงก์ บัญชีธนาคาร และเบอร์โทรศัพท์

---

## 🎯 Features

### 🤖 Detection Capabilities
- ✅ โฆษณาการพนันออนไลน์ (FRAUD_GAMBLING_AD)
- ✅ Phishing/มัลแวร์ (SCAM_MALICIOUS)
- ✅ หลอกลวงทางการเงิน (FRAUD_FINANCIAL)
- ✅ ข่าวลวง (FRAUD_FAKE_NEWS)
- ✅ โฆษณาสินค้าปลอม (FRAUD_PRODUCT)
- ✅ เนื้อหาสำหรับผู้ใหญ่ (ADULT_CONTENT)
- ✅ ข้อความปลอดภัย (SAFE_NORMAL)

### 🔧 Technology Stack
- 🤖 **Gemini 2.5 Flash** - AI Classification
- 🔍 **VirusTotal** - Malicious URL Detection
- 🎯 **Pattern Matching** - Instant Recognition
- 📊 **TF-IDF** - Similarity Analysis
- 🌐 **Playwright** - Headless Browser Scraping
- 🔤 **Homoglyph Detection** - Unicode Spoofing Detection
- 🔥 **Firestore** - Database & Caching

### 🌐 User Interfaces
- 📱 **LINE Official Account** - Chat with Bot
- 🌐 **LIFF Mini App** - Web Interface
  - 🔗 Check Link
  - 📱 Check SMS
  - 📷 Scan QR Code
  - 🏦 Check Bank Account
  - ☎️ Check Phone Number
  - 📜 View History

---

## 📁 Project Structure

```
gungong/
├── src/
│   ├── backend/
│   │   ├── main.py                      # FastAPI app (122 lines) ✨
│   │   ├── routers/                     # API Endpoints (modular)
│   │   │   ├── health.py               # Health check
│   │   │   ├── blacklist.py            # Bank/Phone verification
│   │   │   ├── history.py              # Cache & Feedback
│   │   │   ├── fraud.py                # Fraud detection & URL check
│   │   │   └── webhook.py              # LINE webhook handler
│   │   ├── utils/                       # Helper functions
│   │   │   └── message_helpers.py      # Message analysis helpers
│   │   ├── core/
│   │   │   ├── config.py               # Environment config
│   │   │   ├── models.py               # Pydantic models
│   │   │   ├── fraud_detector.py       # AI fraud detection logic
│   │   │   ├── fraud_patterns.json     # Pattern matching rules
│   │   │   └── performance_config.py   # Performance optimization
│   │   └── services/                    # External services
│   │       ├── gemini_service.py       # Gemini AI
│   │       ├── line_service.py         # LINE Messaging API
│   │       ├── virustotal_service.py   # VirusTotal scanning
│   │       ├── database_service.py     # Firestore operations
│   │       ├── prescreen_service.py    # Pattern matching
│   │       ├── similarity_service.py   # TF-IDF analysis
│   │       ├── headless_scraper_service.py  # Browser scraping
│   │       ├── gambling_detector.py    # Gambling detection
│   │       ├── homoglyph_detector.py   # Unicode spoofing
│   │       ├── blacklist_service.py    # Bank/Phone blacklist
│   │       └── feedback_service.py     # User feedback
│   └── frontend/                        # LIFF Mini App
│       ├── index.html
│       ├── js/
│       │   ├── script.js               # Main application logic
│       │   └── liff.js                 # LIFF SDK
│       ├── img/                         # Assets
│       └── style/                       # CSS
├── config/                               # Configuration files
│   ├── firebase.json
│   ├── firestore.indexes.json
│   ├── firestore.rules
│   └── .env.example                     # Template for reviewers
├── deployment/                           # Deployment files
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── cloudbuild.yaml
├── requirements.txt
├── pyproject.toml
└── secrets/
    └── service-account.json             # Firebase credentials (not in git)
```

**Architecture**: Modular FastAPI backend with router-based organization following best practices

---

## 🚀 Quick Start

### Option 1: Docker Compose (แนะนำ!) ⭐

```bash
# 1. Setup environment
cp config/.env.example .env.yaml
nano .env.yaml

# 2. Add Firebase credentials
# Download service-account.json from Firebase Console
# Place at: secrets/service-account.json

# 3. Start services
cd deployment
docker-compose up -d --build

# 4. Get ngrok URL
open http://localhost:4040

# 5. Configure LINE webhook
# Webhook URL: https://your-ngrok-url.ngrok-free.app/webhook
```

### Option 2: Manual Setup (Development)

```bash
# 1. Clone & Install
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium

# 2. Setup environment
cp config/.env.example .env.yaml
# Edit .env.yaml with your credentials

# 3. Run server
uvicorn src.backend.main:app --reload --port 8000
```

---

## 🔑 Required Credentials

### 1. Gemini API Key
- Visit: https://aistudio.google.com/apikey
- Create API key
- Add to `.env.yaml`: `GOOGLE_API_KEY: "your_key"`

### 2. LINE Bot
- Visit: https://developers.line.biz/console/
- Create Messaging API Channel
- Get credentials:
  - `LINE_CHANNEL_ACCESS_TOKEN`
  - `LINE_CHANNEL_SECRET`

### 3. Firebase
- Visit: https://console.firebase.google.com/
- Create project → Enable Firestore
- Download service account key → `secrets/service-account.json`
- Get project ID → `FIRESTORE_PROJECT_ID`

### 4. VirusTotal (Optional)
- Visit: https://www.virustotal.com/
- Create account → Get API key
- Add to `.env.yaml`: `VIRUSTOTAL_API_KEY: "your_key"`

---

## 📚 API Documentation

### Main Endpoints

| Method | Endpoint | Description | Router |
|--------|----------|-------------|--------|
| GET | `/` | Serve frontend | main.py |
| GET | `/health` | Health check | health.py |
| POST | `/check-fraud` | AI fraud detection | fraud.py |
| POST | `/check-url` | URL verification | fraud.py |
| POST | `/analyze-message` | TF-IDF analysis | fraud.py |
| POST | `/check-bank` | Bank account check | blacklist.py |
| POST | `/check-phone` | Phone number check | blacklist.py |
| GET | `/cache-entries` | History (paginated) | history.py |
| GET | `/history/{id}` | Single history entry | history.py |
| GET | `/cache-stats` | Cache statistics | history.py |
| POST | `/feedback` | User feedback | history.py |
| POST | `/webhook` | LINE webhook | webhook.py |

**Swagger UI**: http://localhost:8000/docs  
**ReDoc**: http://localhost:8000/redoc

---

## 🔄 System Flow

```
User Message
    │
    ▼
┌─────────────────┐
│  Cache Check    │ → Hit? → Return (< 50ms)
└────────┬────────┘
         │ Miss
         ▼
┌─────────────────────────┐
│  Pre-screening          │
│  • Pattern matching     │
│  • URL expansion        │
│  • Homoglyph check      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   Routing Strategy      │
│   Instant/AI/Full       │
└────────┬────────────────┘
         │
         ▼
┌──────────────────────────┐
│   Parallel Execution     │
├──────────┬───────────────┤
│ Gemini AI│ VirusTotal    │
│  (3-5s)  │  (2-4s)       │
└──────────┴───────────────┘
         │
         ▼
┌─────────────────┐
│ Combine Results │
│ Save to Cache   │
└────────┬────────┘
         │
         ▼
     Response
```

### Routing Strategy

| Confidence | Strategy | Actions | Speed |
|------------|----------|---------|-------|
| ≥ 90% | Instant | Pattern only | < 500ms |
| 50-89% | AI Only | Skip URL check | 3-5s |
| < 50% | Full | AI + URL | 5-8s |

---

## ⚡ Performance

### Metrics

| Metric | Value |
|--------|-------|
| Avg Response Time | 2.1s |
| Cache Hit Ratio | 65% |
| API Cost per 1K req | $0.035 |
| Fraud Detection Accuracy | 95%+ |

### Optimization Features

- ✅ Firestore caching (30-day TTL)
- ✅ Parallel AI + URL checking
- ✅ Pattern pre-screening
- ✅ Router-based code organization
- ✅ Rate limiting per endpoint

---

## 🗄️ Database Schema

### Firestore Collections

| Collection | Purpose | TTL |
|------------|---------|-----|
| `fraud_check_cache` | Cache AI results | 30 days |
| `history` | User check history | Permanent |
| `fraud_messages` | Fraud database (TF-IDF) | Permanent |
| `gambling_domains` | Domain blacklist | Permanent |
| `feedback_logs` | User feedback | Permanent |

---

## 🧪 Testing

### REST API Test

```bash
curl -X POST http://localhost:8000/check-fraud \
  -H "Content-Type: application/json" \
  -d '{
    "message": "🎰 สมัครคาสิโนออนไลน์ รับโบนัส 100%"
  }'
```

Expected Response:
```json
{
  "category": "FRAUD_GAMBLING_AD",
  "risk_level": "High",
  "is_fraud": true,
  "confidence_score": 95,
  "reason_th": "โฆษณาการพนันออนไลน์"
}
```

### LINE Webhook Test

1. Start server: `uvicorn src.backend.main:app --reload --port 8000`
2. Start ngrok: `ngrok http 8000`
3. Configure LINE webhook: `https://xxxx.ngrok-free.app/webhook`
4. Send message to bot

---

## 🐳 Docker Commands

```bash
# Navigate to deployment folder
cd deployment

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f gungong-bot

# View ngrok Web UI
open http://localhost:4040

# Restart
docker-compose restart

# Stop
docker-compose stop

# Clean up
docker-compose down
```

---

## 🔐 Security Features

- ✅ Rate limiting per endpoint
- ✅ CORS configuration
- ✅ LINE signature verification
- ✅ Input sanitization
- ✅ Environment-based configs

---

## 📈 Monitoring

### Logs

```bash
# View logs directory
ls -la logs/

# Tail log file
tail -f logs/gungong_$(date +%Y%m%d).log
```

### Log Levels
- **DEBUG**: Development details
- **INFO**: Operational events (Cache HIT, API calls)
- **WARNING**: Degraded performance (VirusTotal unavailable)
- **ERROR**: Critical failures

---

## 🔧 Troubleshooting

### Common Issues

**Import Error**
```bash
# Run from project root
cd /Users/analeotic/Desktop/project/personal/gungong
uvicorn src.backend.main:app --reload
```

**LINE Webhook Not Working**
1. Check ngrok is running: `curl http://localhost:4040/api/tunnels`
2. Verify webhook URL in LINE console
3. Check LINE credentials in `.env.emulator`

**Gemini API Error**
- Verify `GOOGLE_API_KEY` in `.env.emulator`
- Check quota: https://aistudio.google.com/

**Firestore Connection Error**
- Verify `secrets/service-account.json` exists
- Check `FIRESTORE_PROJECT_ID` in `.env.emulator`

---

## 🎯 Architecture Principles

1. **Modular Design** - Router-based architecture (FastAPI best practice)
2. **Fail-Safe** - Always return safe result on error
3. **Multi-Layer Caching** - Firestore + Pre-screen
4. **Parallel Execution** - AI + URL checks run simultaneously
5. **Event-Driven** - Webhook → Pre-screen → Route → Detect → Respond

---

## 📝 Recent Updates

### v2.0.0 - Modular Refactoring (2025-12-01)
- ✅ Refactored main.py from 1,662 lines → 122 lines (93% reduction)
- ✅ Created router-based architecture (health, blacklist, history, fraud, webhook)
- ✅ Added utils module for helper functions
- ✅ Improved code maintainability and scalability
- ✅ Implemented mention-based group message processing

### v1.0.0 - Initial Release
- ✅ Gemini AI integration
- ✅ LINE Bot + LIFF Mini App
- ✅ Firestore caching
- ✅ Multi-layer detection

---

## 📄 License

MIT

---

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

---

## 📞 Support

For questions or issues, please check:
- 📖 Code comments in routers
- 📊 API documentation at `/docs`
- 🔍 Debug logs in `logs/` directory

---

**Made with ❤️ for safer online communication in Thailand**
