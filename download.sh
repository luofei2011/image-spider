#!/bin/bash

root=$(pwd)
logDir=$root/log

imageUrlList=$logDir/images_log

# remove repeat
sort -u $imageUrlList -o $imageUrlList

wget -t 1 -O
