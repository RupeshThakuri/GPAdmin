# Use official Node image
FROM node:latest

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Build Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

#for executing the function in docker use 
#docker build -t frontend .
