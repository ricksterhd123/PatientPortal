#! /bin/bash
docker-compose -f .vscode/docker-compose.yml stop
# cd patientportal
# echo "Cleaning up ..."
# for file in 'public/scripts'/*; do
#     echo "Removing $file"
#     rm $file
# done
# rm -r public/scripts
# echo "Finished"