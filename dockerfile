# Stage 1: Build for both ARM64 and AMD64
FROM --platform=$BUILDPLATFORM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 2: Nginx static server
FROM nginx:stable-alpine as production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
