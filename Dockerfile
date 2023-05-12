# Use an official Node.js runtime as the base image
 FROM node:14-alpine

 # Set the working directory in the container
 WORKDIR /app

 # Copy the package.json and package-lock.json files to the container
 COPY package*.json ./

 # Install the application dependencies
 RUN npm install

 # Copy the application code to the container
 COPY . .

 # Expose the desired port (change it if needed)
 EXPOSE 3000

 # Start the application
 CMD ["npm", "start"]