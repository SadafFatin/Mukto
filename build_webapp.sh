#!/bin/sh
echo "----- Building PWA "

#ionic build project
ionic cap sync
ionic build --prod

echo "----- moving .htaccess. -----"
cp  ./.htaccess www

echo "----- compressing contents. -----"
#zip -r dist.zip www

#edyict 
#scp -r dist.zip eidyict@132.148.79.243:~/public_html/nutritionprofile
#nutrition profile
#scp -r dist.zip nutritionprofile@243.79.148.132:~/public_html/
#scp -i id_rsa.pub -r dist.zip nutritionprofile@243.79.148.132:~/public_html/

#firebase deployment configuration
firebase deploy

echo "----- Deployment completed. -----"

