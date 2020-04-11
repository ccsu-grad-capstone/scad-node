## Shall script to run scad-ui

HTTP_PORT=8081


echo " "
echo "*****************************************************************************"
echo " "
echo "Starting 'SCAD Client' on HTTP_PORT=${HTTP_PORT} ..."
echo " "
echo "*****************************************************************************"
echo " "

echo " "
echo "Now performing server install ..."
echo " "
npm install
echo " "
echo "Server install done."
echo " "

npm run serve

# filepath=`pwd`
# echo "File path="${filepath}
# echo " "



# osascript -e 'tell application "Terminal" to do script "pwd;cd '"$filepath"';pwd;cd server;pwd;npm run serve"'
# osascript -e 'tell application "Terminal" to do script "pwd;cd '"$filepath"';pwd;cd client;pwd;npm run serve"'
