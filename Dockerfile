# Stage 1: Build VitePress
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache git

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run docs:build

# Stage 2: Serve with Nginx custom
FROM nginx:alpine
COPY --from=builder /app/.vitepress/dist /usr/share/nginx/html
COPY --from=builder /app/.vitepress/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80