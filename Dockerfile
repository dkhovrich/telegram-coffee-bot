# Use an official Node.js runtime as a parent image
FROM node:18.15-alpine

# Set the working directory to /app
WORKDIR /src

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript project
RUN npm run build

# Start the application
CMD ["npm", "start"]