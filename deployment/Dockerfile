# Stage 1: Builder
FROM python:3.10-slim as builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

COPY requirements.txt .
# Install to /install directory
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt
RUN pip install --prefix=/install playwright

# Stage 2: Final
FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PLAYWRIGHT_BROWSERS_PATH=/app/pw-browsers

# Copy installed packages from builder to system location
COPY --from=builder /install /usr/local

# Install system dependencies for Playwright (minimal)
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    && playwright install-deps chromium \
    && rm -rf /var/lib/apt/lists/*

# Copy source code
COPY src/ ./src/

# Create user
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

# Install Chromium as appuser
USER appuser
RUN playwright install chromium

EXPOSE 8080

# Use exec form with sh -c to properly expand PORT variable (Cloud Run requirement)
CMD ["sh", "-c", "uvicorn src.backend.main:app --host 0.0.0.0 --port ${PORT:-8080}"]