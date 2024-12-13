#!/bin/bash
if [ "$CI" = "true" ]; then
  curl -L https://encore.dev/install.sh | bash
  echo "export ENCORE_INSTALL=/home/runner/.encore" >> ~/.bashrc
  echo "export PATH=/home/runner/.encore/bin:$PATH" >> ~/.bashrc
  source ~/.bashrc
fi