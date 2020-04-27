#! /bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
(crontab -l ; echo "*/5 * * * * git -C $DIR pull && docker-compose -f $DIR/docker-compose.yml up -d --build")| crontab -
echo "Setup auto update in crontab"
echo "Starting now..."
docker-compose -f "docker-compose.yml" up -d --build
echo "Done"

