# syntax=docker/dockerfile:1.4

###############################################################################
# 1) Builder image: compile your React / Vite app + inject prod env variables #
###############################################################################

FROM --platform=$BUILDPLATFORM node:18-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

# Define ARGs so Docker can pass in build-time secrets to Vite
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Pass the ARGs as environment variables directly to the build command
RUN VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
    npm run build


###############################################################################
# 2) Production image: serve the built SPA with nginx                         #
###############################################################################

FROM nginx:alpine

# Copy the built assets to the web server's root directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the site-specific Nginx config to the correct directory
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80