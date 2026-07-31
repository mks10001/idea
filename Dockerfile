# Build a lightweight Docker image for the NestJS backend
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
COPY pnpm-lock.yaml* ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main.js"]
