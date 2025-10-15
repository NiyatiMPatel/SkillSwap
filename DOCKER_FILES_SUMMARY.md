# 🐳 Docker Files Summary

This document provides an overview of all Docker-related files in the SkillSwap project.

## 📁 Files Created

### Root Directory

1. **`docker-compose.yml`** - Main Docker Compose configuration for development
   - Orchestrates MongoDB, server, and client services
   - Development mode by default with hot reload
   - Volume mounts for live code updates

2. **`docker-compose.prod.yml`** - Production Docker Compose configuration
   - Optimized for production deployment
   - Static builds with Nginx for frontend
   - No development dependencies

3. **`.env.docker`** - Environment variables template
   - Configuration for Docker services
   - Copy to `.env` and customize

4. **`.dockerignore`** - Root level ignore file
   - Excludes unnecessary files from all Docker builds

5. **`DOCKER.md`** - Comprehensive Docker documentation
   - Setup instructions
   - Command reference
   - Troubleshooting guide

### Server Directory (`/server`)

6. **`server/Dockerfile`** - Backend container configuration
   - Multi-stage build (development/production)
   - Based on node:18-alpine
   - Port 5000

7. **`server/.dockerignore`** - Server-specific ignore file
   - Excludes node_modules, .env, etc.

### Client Directory (`/client`)

8. **`client/Dockerfile`** - Frontend container configuration
   - Multi-stage build (development/production)
   - Development: Vite dev server (node:18-alpine)
   - Production: Nginx static file server (nginx:alpine)
   - Port 5173 (dev) or 80 (prod)

9. **`client/nginx.conf`** - Nginx configuration for production
   - React Router SPA support
   - Gzip compression
   - Security headers
   - Caching strategy

10. **`client/.dockerignore`** - Client-specific ignore file
    - Excludes build files, node_modules, etc.

## 🚀 Quick Start Commands

### Development Mode
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f
```

### Production Mode
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Management
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild containers
docker-compose build --no-cache
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  Docker Network                     │
│              (skillswap-network)                    │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │   MongoDB   │  │   Server    │  │   Client   │ │
│  │   (7.0)     │←→│  (Node 18)  │←→│ (Nginx)    │ │
│  │             │  │             │  │            │ │
│  │  Port:27017 │  │  Port: 5000 │  │  Port: 80  │ │
│  └─────────────┘  └─────────────┘  └────────────┘ │
│         ↓                                           │
│  ┌─────────────┐                                   │
│  │  Volumes    │                                   │
│  │  - mongodb_ │                                   │
│  │    data     │                                   │
│  │  - mongodb_ │                                   │
│  │    config   │                                   │
│  └─────────────┘                                   │
└─────────────────────────────────────────────────────┘
         ↓
   Host Machine
   - localhost:3000 (Client)
   - localhost:5000 (Server API)
   - localhost:27017 (MongoDB)
```

## 🎯 Key Features

### Multi-Stage Builds
- **Development**: Hot reload, source maps, verbose logging
- **Production**: Optimized builds, no dev dependencies, minimal size

### Service Configuration

#### MongoDB
- **Image**: mongo:7.0
- **Authentication**: Root user with credentials
- **Persistence**: Named volumes for data and config
- **Health Check**: Automatic MongoDB ping test

#### Server (Backend)
- **Base**: node:18-alpine
- **Features**:
  - Auto-restart with nodemon (dev)
  - Health check endpoint (/api/health)
  - JWT authentication
  - MongoDB connection
- **Environment**: Configurable via .env

#### Client (Frontend)
- **Development**: 
  - Vite dev server with HMR
  - Port 5173
- **Production**:
  - Static build served by Nginx
  - Optimized bundle size
  - Port 80
  - SPA routing support

## 📊 Container Sizes (Approximate)

| Service | Development | Production |
|---------|-------------|------------|
| MongoDB | 700 MB | 700 MB |
| Server  | 250 MB | 150 MB |
| Client  | 400 MB | 50 MB |
| **Total** | **1.35 GB** | **900 MB** |

## 🔒 Security Features

1. **Non-root users** in containers (where possible)
2. **Alpine Linux** base images (minimal attack surface)
3. **Security headers** via Helmet (server) and Nginx (client)
4. **Environment variables** for sensitive data
5. **Network isolation** via Docker networks
6. **Health checks** for service monitoring
7. **.dockerignore** to prevent sensitive file leaks

## 🛠️ Development Workflow

1. **Code Changes**: 
   - Edit files in `./server` or `./client`
   - Changes auto-reload in containers (dev mode)

2. **View Logs**:
   ```bash
   docker-compose logs -f server
   docker-compose logs -f client
   ```

3. **Execute Commands**:
   ```bash
   docker-compose exec server sh
   docker-compose exec client sh
   ```

4. **Database Access**:
   ```bash
   docker-compose exec mongodb mongosh -u admin -p password123
   ```

## 🌐 Port Mappings

| Service | Container Port | Host Port | Configurable |
|---------|---------------|-----------|--------------|
| MongoDB | 27017 | 27017 | No |
| Server  | 5000 | 5000 | Via .env |
| Client (dev) | 5173 | 3000 | Via .env |
| Client (prod) | 80 | 80 | Via .env |

## 📝 Environment Variables

Key variables in `.env`:

```env
# Mode
NODE_ENV=development|production

# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
MONGO_DB_NAME=skillswap

# Server
SERVER_PORT=5000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Client
CLIENT_PORT=3000
CLIENT_URL=http://localhost:3000
VITE_API_URL=http://localhost:5000/api
```

## 🔄 CI/CD Integration

These Docker files are ready for CI/CD pipelines:

### GitHub Actions Example
```yaml
- name: Build Docker Images
  run: docker-compose -f docker-compose.prod.yml build

- name: Run Tests
  run: docker-compose -f docker-compose.prod.yml run server npm test

- name: Deploy
  run: docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Additional Resources

- **[DOCKER.md](./DOCKER.md)** - Full Docker documentation
- **[README.md](./README.md)** - Project overview
- **[docker-compose.yml](./docker-compose.yml)** - Development config
- **[docker-compose.prod.yml](./docker-compose.prod.yml)** - Production config

## 🆘 Need Help?

1. Check **[DOCKER.md](./DOCKER.md)** for detailed guides
2. Run `docker-compose logs` to view service logs
3. Verify `.env` configuration
4. Ensure Docker is running: `docker --version`
5. Check service health: `docker-compose ps`

---

**Last Updated**: October 2024  
**Docker Version**: 20.10+  
**Docker Compose Version**: 2.0+
