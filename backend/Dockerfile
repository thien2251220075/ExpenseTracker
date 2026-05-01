FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .
EXPOSE 4000
CMD ["node", "server.js"]
