# syntax=docker/dockerfile:1

########################################
# Stage 1 — build the Meteor bundle
########################################
FROM node:22-bookworm AS builder

ENV METEOR_ALLOW_SUPERUSER=true

RUN apt-get update && apt-get install -y --no-install-recommends \
      curl ca-certificates python3 g++ make \
 && rm -rf /var/lib/apt/lists/*

# Install the Meteor tool. The actual release is read from .meteor/release below.
RUN curl -fsSL https://install.meteor.com/ | sh
ENV PATH="/root/.meteor:${PATH}"

WORKDIR /src

# Prime the Meteor release cache (its own layer so it caches across code changes)
COPY .meteor/ ./.meteor/
RUN meteor --version

# Install app npm deps with Meteor's bundled npm
COPY package.json package-lock.json ./
RUN meteor npm ci

# Build the server-only production bundle
COPY . .
RUN meteor build --directory /build --server-only --architecture os.linux.x86_64 \
 && cd /build/bundle/programs/server && npm install --omit=dev && npm cache clean --force

########################################
# Stage 2 — lean runtime image
########################################
FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /build/bundle ./

# Railway injects PORT; the Meteor bundle listens on process.env.PORT
EXPOSE 3000
CMD ["node", "main.js"]
