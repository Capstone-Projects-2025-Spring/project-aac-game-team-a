# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port your app runs on (adjust if needed)
EXPOSE 3001

# Start the app
CMD ["node", "server.js"]
