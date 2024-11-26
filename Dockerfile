# Use the official Node.js image to build the app
FROM node:16 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application's source code
COPY . .

# Build the Next.js app for production
RUN npm run build

# Use an NGINX image to serve the build files
FROM nginx:alpine

# Copy the Next.js build output to the default NGINX public directory
# For Next.js, the static files are in .next/static
COPY --from=build /app/.next/static /usr/share/nginx/html/_next/static
COPY --from=build /app/public /usr/share/nginx/html

# Copy custom NGINX configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
