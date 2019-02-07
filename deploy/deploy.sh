usage() { echo "Usage: ENV=<env> $0 -p <parametersFilePath> -t <templateFilePath> -g <resourceGroupName> -n <deploymentName> -l <resourceGroupLocation>" 1>&2; exit 1; }

env=${ENV:-dev}

declare templateFilePath=""
declare parametersFilePath=""
declare resourceGroupName=""
declare deploymentName=""
declare resourceGroupLocation=""

# Initialize parameters specified from command line
while getopts ":t:g:n:l:p:" arg; do
	case "${arg}" in
		t)
			templateFilePath=${OPTARG}
			;;
    p)
			parametersFilePath=${OPTARG}
			;;
		g)
			resourceGroupName=${OPTARG}
			;;
		n)
			deploymentName=${OPTARG}
			;;
		l)
			resourceGroupLocation=${OPTARG}
			;;
		esac
done
shift $((OPTIND-1))

#Check for parameters if some required parameters are missing
if [[ -z "$templateFilePath" ]]; then
	echo "Missing templateFilePath"
	exit 2;
fi

if [[ -z "$parametersFilePath" ]]; then
	echo "Missing parametersFilePath"
	exit 2;
fi

if [[ -z "$resourceGroupName" ]]; then
	echo "Missing ResourceGroupName"
	exit 2;
fi

if [[ -z "$deploymentName" ]]; then
	echo "Missing DeploymentName"
	exit 2;
fi

if [[ -z "$resourceGroupLocation" ]]; then
	echo "Missing ResourceGroupLocation"
	exit 2;
fi

jq -s '.[0] * .[1]' ${parametersFilePath} deploy/config/${env}.json > /tmp/deploy_${deploymentName}.json

#login to azure using your credentials
az account show 1> /dev/null

if [ $? != 0 ];
then
	az login
fi

#Check for existing RG
az group show -n "$resourceGroupName" 1> /dev/null

if [ $? != 0 ]; then
	echo "Resource group with name" $resourceGroupName "could not be found. Creating new resource group.."
	set -e
	(
		set -x
		az group create --name "$resourceGroupName" --location "$resourceGroupLocation" 1> /dev/null
	)
	else
	echo "Using existing resource group..."
fi

#Start deployment
echo "Starting deployment..."
(
	set -x
	az group deployment create --name "$deploymentName" --resource-group "$resourceGroupName" --template-file "$templateFilePath" --parameters "@/tmp/deploy_${deploymentName}.json" --verbose
)

if [ $?  == 0 ];
 then
	echo "Template has been successfully deployed"
fi