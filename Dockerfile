FROM node:20-slim

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the default HTTP port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Run the server
CMD ["npm", "start"] 