#!/bin/bash
if [ "$CI" = "true" ]; then
  curl -L https://encore.dev/install.sh | bash
  echo 'export ENCORE_INSTALL="/home/runner/.encore"' >> $GITHUB_ENV
  echo 'export PATH="$ENCORE_INSTALL/bin:$PATH"' >> $GITHUB_ENV
fi