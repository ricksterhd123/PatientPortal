#! /bin/bash
cd patientportal
npm install
npm run compile
cd ..
docker-compose -f .vscode/docker-compose.yml up -d --build
