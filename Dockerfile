# === Stage 1: Build the React Application ===
# Use Node 20 with the small 'alpine' version for a smaller image size.
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package files (package.json and package-lock.json/yarn.lock)
# This allows Docker to cache the installation step
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# ARGS are values passed at build time (like your API key)
# ENV VITE_... makes the variable available during the 'npm run build' step
# The key for Vite MUST start with VITE_ to be included in the build output.
ARG GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$GEMINI_API_KEY

# OPTIONAL: Create a .env.local file with the key for Vite if needed
# Vite usually injects VITE_... env vars directly, but this covers cases where
# you might use a standard `process.env.GEMINI_API_KEY` or need a file.
# NOTE: The variable is only available if it starts with VITE_... as shown above.
# RUN echo "VITE_GEMINI_API_KEY=${GEMINI_API_KEY}" > .env.local

# Build the React app for production (creates the 'dist' folder)
RUN npm run build

# === Stage 2: Serve the Built Application with Nginx ===
# Start a new, tiny Nginx image
FROM nginx:1.25-alpine

# Set the port Nginx will listen on inside the container
EXPOSE 8080

# Remove the default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom nginx.conf file from your project to the Nginx config directory
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the final built files (from the 'dist' folder of the 'build' stage)
# to the Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# The default Nginx CMD already runs Nginx in the foreground:
# CMD ["nginx", "-g", "daemon off;"]
