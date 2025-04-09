# Use an official Node.js image as the base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app code
COPY . .

# Expose port 5173 for Vite dev server
EXPOSE 5173

# Start the Vite dev server
ENV backendHost=""
CMD [backendHost, "npm", "run", "dev", "--", "--host"]
