#!/bin/bash
if [ "$CI" = "true" ]; then
  curl -L https://encore.dev/install.sh | bash
fi