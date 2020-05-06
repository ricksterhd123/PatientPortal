# PreLaunch for windows.
Set-Location 'patientportal'
if (![System.IO.File]::Exists("./package-lock.json")) {
    npm install
}
npm run compile
Set-Location ..
docker-compose -f .vscode/docker-compose.yml up -d --build
