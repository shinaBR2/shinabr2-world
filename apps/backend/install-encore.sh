#!/bin/bash
if [ "$CI" = "true" ]; then
  curl -L https://encore.dev/install.sh | bash
  export ENCORE_INSTALL="/home/runner/.encore"
  export PATH="$ENCORE_INSTALL/bin:$PATH"
fi