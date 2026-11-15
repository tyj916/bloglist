#!/bin/bash

echo "Build script"

npm ci
npm ci --prefix server
npm ci --prefix client
npm run build
