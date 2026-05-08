# Use Node.js LTS version
FROM node:18-alpine

# Install dependencies for PDF generation
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    bash

# Set working directory
WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/

# Install server dependencies
WORKDIR /app/server
RUN npm install --production

# Copy server code
COPY server/ ./

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]