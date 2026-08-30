# ==========================================
# Multi-Stage Dockerfile for Bluez Luxoria
# ==========================================

# --- Stage 1: Build the Vite Application ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy full application source code
COPY . .

# Build production bundle into /app/dist
RUN npm run build

# --- Stage 2: Serve with Ultra-Lightweight Nginx ---
FROM nginx:alpine AS runner

# Remove default Nginx welcome site
RUN rm -rf /usr/share/nginx/html/*

# Copy built production assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
