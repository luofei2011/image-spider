#!/bin/bash

root=$(pwd)
logDir=$root/log
imageDir=$root/images

imageUrlList=$logDir/images_log

# remove repeat
sort -u $imageUrlList -o $imageUrlList

cd $imageDir

# you can change it  to download in background.
# for url in $(cat $imageUrlList) --> wget .. &
wget -t 1 -i $imageUrlList

cd -

exit 0
