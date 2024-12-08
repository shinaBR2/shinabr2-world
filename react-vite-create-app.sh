#!/bin/bash

if [ -z "$1" ]; then
    echo "Please provide an app name"
    echo "Usage: ./create-app.sh <app-name>"
    exit 1
fi

APP_NAME=$1
TEMPLATE_DIR="app-templates/react-vite"  # Source template directory
APP_DIR="apps/$APP_NAME"                 # Destination directory

# Check if template directory exists
if [ ! -d "$TEMPLATE_DIR" ]; then
    echo "❌ Error: Template directory ($TEMPLATE_DIR) not found!"
    exit 1
fi

# Create the new app directory
mkdir -p "$APP_DIR"

# Copy template contents (note the /* to copy contents, not the folder itself)
cp -r "$TEMPLATE_DIR/"* "$APP_DIR/"

# Update package.json in the new app directory
cat > "$APP_DIR/package.json" << EOF
{
  "name": "$APP_NAME",
  "private": true
  // ... rest of your package.json content
}
EOF

echo "🎉 Created new app: $APP_NAME"