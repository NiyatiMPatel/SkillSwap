# Stage 1: Base
FROM node:18-alpine AS base
WORKDIR /app

# Stage 2: Dependencies
FROM base AS dependencies
COPY package*.json ./
RUN npm ci --only=production

# Stage 3: Development dependencies
FROM base AS dev-dependencies
COPY package*.json ./
RUN npm ci

# Stage 4: Production
FROM base AS production
WORKDIR /app

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application files
COPY . .

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]

# Stage 5: Development
FROM base AS development
WORKDIR /app

# Copy all dependencies
COPY --from=dev-dependencies /app/node_modules ./node_modules

# Copy application files
COPY . .

# Expose port
EXPOSE 5000

# Set environment to development
ENV NODE_ENV=development

# Start the application with nodemon
CMD ["npm", "run", "dev"]
