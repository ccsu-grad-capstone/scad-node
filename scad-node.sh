## Shall script to run scad-ui

HTTP_PORT=4000


echo " "
echo "*****************************************************************************"
echo " "
echo "Starting 'SCAD Node' on HTTP_PORT=${HTTP_PORT} ..."
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

