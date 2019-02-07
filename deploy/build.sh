acr_name=${ACR_NAME:-yossregistry}

#login to azure using your credentials
az account show 1> /dev/null

if [ $? != 0 ];
then
	az login
fi

az acr build --registry $acr_name --image yosswebsocket:latest .
