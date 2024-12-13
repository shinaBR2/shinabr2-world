FROM --platform=linux/amd64 node:slim

RUN apt-get update && apt-get install -y curl
RUN curl -L https://encore.dev/install.sh | bash
ENV PATH="/root/.encore/bin:${PATH}"

# Focus only on the backend directory
WORKDIR /app

# Copy just the backend project files
COPY . .

# Install dependencies specific to this project
RUN npm install

# Build and run
CMD ["/root/.encore/bin/encore", "run", "--listen", "0.0.0.0"]