# ➤ Dev stage: install deps & run react-scripts start
FROM node:18-alpine

# 1) Set working dir
WORKDIR /app

# 2) Install dependencies (only package files)
COPY package*.json ./
RUN npm install

# 3) Copy the rest of your source
COPY . .

# 4) Set the PORT environment variable for React dev server
ENV PORT=3001

# 5) Accept REACT_APP_API_URL as build argument (optional default)
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# 6) Expose the port
EXPOSE 3001

# 7) Default command: start the dev server
CMD ["npm", "start"]