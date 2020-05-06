# PreLaunch for windows.
Set-Location 'patientportal'
npm run compile
Set-Location ..
docker-compose -f .vscode/docker-compose.yml up -d --build
