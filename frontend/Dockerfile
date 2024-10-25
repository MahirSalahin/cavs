# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json ./

# Install pnpm
RUN npm install -g pnpm

# Install the dependencies
RUN pnpm install

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js application
# RUN pnpm build

# Expose the port that the Next.js app will run on
EXPOSE 3000

# Run the Next.js application
CMD ["pnpm", "run", "dev"]