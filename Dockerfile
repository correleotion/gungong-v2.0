# ===========================================
# Multi-Stage Dockerfile for GunGong
# Frontend (React) + Backend (FastAPI)
# WITHOUT Playwright (for faster startup)
# ===========================================

# ============================================
# Stage 1: Build Frontend
# ============================================
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

# Copy frontend package files
COPY src/frontend/package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy frontend source
COPY src/frontend/ ./

# Build React app
RUN npm run build

# ============================================
# Stage 2: Build Backend Dependencies
# ============================================
FROM python:3.10-slim AS backend-builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Copy requirements
COPY requirements.txt .

# Install Python dependencies to /install directory (WITHOUT playwright)
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt

# ============================================
# Stage 3: Final Production Image
# ============================================
FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Copy Python packages from builder
COPY --from=backend-builder /install /usr/local

# Copy backend source code
COPY src/backend/ ./src/backend/

# Copy built frontend from frontend-builder
COPY --from=frontend-builder /frontend/dist ./src/backend/static

# Create user for security
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8080

# Start FastAPI server
# PORT is provided by Cloud Run
CMD ["sh", "-c", "uvicorn src.backend.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
