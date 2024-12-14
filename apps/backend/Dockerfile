FROM --platform=$BUILDPLATFORM node:20.10.0-slim

RUN apt-get update -y && apt-get install -y curl openssl


RUN curl -L https://encore.dev/install.sh | bash
ENV PATH="/root/.encore/bin:${PATH}"

# Focus only on the backend directory
WORKDIR /app

COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY turbo.json ./

# Copy the packages directory (if your backend depends on workspace packages)
COPY packages/database ./packages/database

# Copy the backend app
COPY apps/backend/ ./apps/backend/

# Install pnpm
RUN npm install -g pnpm

# Configure pnpm to hoist dependencies
# This setting tells pnpm to put dependencies
# in the root node_modules directory
# where they're easily accessible to all packages.
# When packages like fluent-ffmpeg look for their dependencies
# using Node.js's default module resolution algorithm
# (looking up the directory tree),
# they'll find what they need.
# RUN echo "shamefully-hoist=true" > /root/.npmrc
RUN echo "shamefully-hoist=true\nnode-linker=hoisted" > /root/.npmrc

# https://github.com/prisma/prisma/discussions/22519
COPY ./packages/database/prisma /app/packages/database/prisma/

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Generate Prisma client using the workspace command

# RUN pnpm dlx prisma generate
# RUN pnpm --filter=database db:generate

# Set working directory to backend
WORKDIR /app/apps/backend


# Build and run
CMD ["/root/.encore/bin/encore", "run", "--listen", "0.0.0.0"]