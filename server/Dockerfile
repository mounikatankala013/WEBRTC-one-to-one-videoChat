# Stage 1: Build the React application
FROM node:16-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .




# Expose port 8000
EXPOSE 8000

CMD ["npm","start"]

