# 🐳 Docker Setup Guide

This guide explains how to run the SkillSwap application using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0 or higher)

## Quick Start

### 1. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.docker .env
```

Edit `.env` and update the values as needed:

```env
# Environment (development or production)
NODE_ENV=development

# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
MONGO_DB_NAME=skillswap

# Server Configuration
SERVER_PORT=5000
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# Client Configuration
CLIENT_PORT=3000
CLIENT_EXPOSE_PORT=5173
CLIENT_URL=http://localhost:3000
VITE_API_URL=http://localhost:5000/api
```

### 2. Start All Services

**Development Mode** (with hot reload):

```bash
docker-compose up
```

**Production Mode**:

```bash
NODE_ENV=production docker-compose up
```

**Run in Background** (detached mode):

```bash
docker-compose up -d
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **MongoDB**: localhost:27017

## Docker Commands

### Build Services

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build server
docker-compose build client

# Build without cache (fresh build)
docker-compose build --no-cache
```

### Start Services

```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up server
docker-compose up client mongodb

# Start in detached mode
docker-compose up -d
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v

# Stop specific service
docker-compose stop server
```

### View Logs

```bash
# View all logs
docker-compose logs

# View logs for specific service
docker-compose logs server
docker-compose logs client
docker-compose logs mongodb

# Follow logs (real-time)
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100
```

### Execute Commands in Container

```bash
# Access server container shell
docker-compose exec server sh

# Access client container shell
docker-compose exec client sh

# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password123
```

### Check Service Status

```bash
# View running containers
docker-compose ps

# View detailed container info
docker inspect skillswap-server
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart server
```

## Architecture

The Docker setup consists of three main services:

### 1. MongoDB (`mongodb`)
- **Image**: mongo:7.0
- **Port**: 27017
- **Volumes**: 
  - `mongodb_data` - Database files
  - `mongodb_config` - Configuration files
- **Health Check**: Automatic MongoDB ping test

### 2. Backend Server (`server`)
- **Base Image**: node:18-alpine
- **Port**: 5000
- **Features**:
  - Multi-stage build (development/production)
  - Auto-restart on file changes (development mode)
  - Health check endpoint
- **Dependencies**: MongoDB

### 3. Frontend Client (`client`)
- **Development**: node:18-alpine with Vite dev server
- **Production**: nginx:alpine serving static files
- **Port**: 3000 (mapped from 5173 in dev, 80 in prod)
- **Features**:
  - Hot module replacement (development)
  - Optimized production build with Nginx
  - React Router SPA support

## Environment Modes

### Development Mode (Default)

- Hot reload for both frontend and backend
- Source maps enabled
- Verbose logging
- Volume mounts for live code updates

```bash
docker-compose up
```

### Production Mode

- Optimized builds
- Static file serving with Nginx
- No source maps
- Minimal logging

```bash
NODE_ENV=production docker-compose up
```

## Volumes

### Persistent Volumes

- `mongodb_data` - Stores MongoDB database files
- `mongodb_config` - Stores MongoDB configuration

### Development Volumes

- `./server:/app` - Live code updates for backend
- `./client:/app` - Live code updates for frontend

## Networking

All services communicate through the `skillswap-network` bridge network:

- Client → Server: http://server:5000
- Server → MongoDB: mongodb://mongodb:27017

External access:
- Client: http://localhost:3000
- Server: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## Troubleshooting

### Port Already in Use

If ports 3000, 5000, or 27017 are already in use, update `.env`:

```env
SERVER_PORT=5001
CLIENT_PORT=3001
```

### Database Connection Issues

Check MongoDB health:

```bash
docker-compose logs mongodb
docker-compose exec mongodb mongosh -u admin -p password123 --eval "db.runCommand({ping: 1})"
```

### Container Won't Start

View detailed logs:

```bash
docker-compose logs server
docker-compose logs client
```

Rebuild containers:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Clear All Data

Remove all containers, networks, and volumes:

```bash
docker-compose down -v
docker system prune -a
```

### Permission Issues (Linux/Mac)

If you encounter permission issues with volumes:

```bash
sudo chown -R $USER:$USER .
```

## Health Checks

### Server Health Check

```bash
curl http://localhost:5000/api/health
```

### MongoDB Health Check

```bash
docker-compose exec mongodb mongosh -u admin -p password123 --eval "db.runCommand({ping: 1})"
```

## Production Deployment

### 1. Update Environment Variables

Create a production `.env` file with secure values:

```env
NODE_ENV=production
MONGO_ROOT_PASSWORD=secure_password_here
JWT_SECRET=super_secure_secret_key_here
```

### 2. Build Production Images

```bash
NODE_ENV=production docker-compose build
```

### 3. Run in Production Mode

```bash
NODE_ENV=production docker-compose up -d
```

### 4. Monitor Logs

```bash
docker-compose logs -f
```

## Docker Compose File Structure

```yaml
services:
  mongodb:     # Database service
  server:      # Backend API service
  client:      # Frontend web service

networks:
  skillswap-network:  # Internal network

volumes:
  mongodb_data:       # Database persistence
  mongodb_config:     # MongoDB config
```

## Best Practices

1. **Always use environment variables** - Never hardcode sensitive data
2. **Use .dockerignore** - Exclude unnecessary files from builds
3. **Multi-stage builds** - Separate development and production stages
4. **Health checks** - Ensure services are running properly
5. **Volume management** - Persist important data
6. **Network isolation** - Use Docker networks for service communication
7. **Minimal base images** - Use Alpine Linux for smaller image sizes
8. **Security** - Keep images updated and use non-root users where possible

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)

---

**Need help?** Create an issue in the repository or check the main [README.md](./README.md) for more information.
