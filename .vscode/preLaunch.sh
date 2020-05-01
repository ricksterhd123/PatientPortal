
cd patientportal
npm install
babel views/components -d public/scripts
cd ..
docker-compose -f .vscode/docker-compose.yml up -d --build