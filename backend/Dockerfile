FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Explicitly set PORT to 3000 and override any existing PORT env var
ENV PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "PORT=3000 npm run start"]