#!/bin/sh
echo "----- Building Andoird app :: ionic capacitor ..."


#enable android x issues
npx jetify

#Syncing letest codes for android platform
ionic cap sync android 


#building apk
ionic capacitor build android --prod
##sh ./deploy.sh

echo "----- Build and sync completed. -----"
