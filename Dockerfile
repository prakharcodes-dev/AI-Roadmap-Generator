# Multi-Stage Dockerfile for AI Roadmap Generator (Single Container Deployment)

# Stage 1: Build Frontend React SPA
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy package metadata and install frontend dependencies
COPY frontend/package*.json ./
RUN npm ci || npm install

# Copy frontend source code and build static distribution bundle
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Python Backend Server
FROM python:3.11-slim AS production

WORKDIR /app

# Configure Python environment
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=5000

# Install minimal OS build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install Python packages
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy built frontend assets from Stage 1 into /app/frontend/dist
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Copy backend source code into /app/backend
COPY backend/ /app/backend

# Create uploads directory
RUN mkdir -p /app/backend/uploads

WORKDIR /app/backend

# Expose default port
EXPOSE 5000

# Start Flask application (listens on 0.0.0.0:${PORT})
CMD ["python", "app.py"]
