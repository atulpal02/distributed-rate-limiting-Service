# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Run app
CMD ["node", "src/server.js"]