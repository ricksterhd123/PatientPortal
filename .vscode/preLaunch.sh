#! /bin/bash
cd patientportal
if [ ! -f package-lock.json ]; then
    echo "package-lock.json not found, running npm install"
    npm install
fi
npm run compile
cd ..
docker-compose -f .vscode/docker-compose.yml up -d --build
