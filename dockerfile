# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install -g @sveltejs/kit

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build


# Expose the port that your app runs on
EXPOSE 4173

# Command to run the app
CMD ["npm", "run","preview"]
