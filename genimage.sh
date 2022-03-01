         

if [ $# -lt 1 ]; then
    echo "Missed argument docker image name. Script aborted."
    exit 1
fi

IMAGE_NAME=$1
DOCKERFILE="Dockerfile"


if ! [ -f $DOCKERFILE ]; then
    echo "Missed Dockerfile. You need to have a Dockerfile in order to build a Docker image"
    exit 1
fi

# Build a new jar with latest source


# Generate a docker image
docker build -t ${IMAGE_NAME} .
if [ $? -ne 0 ]; then
    echo "Error in docker image building process. Script aborted."
    exit 1
fi

docker save ${IMAGE_NAME} > ${IMAGE_NAME}.tar
if [ $? -ne 0 ]; then
    echo "Error in docker image save process. Script aborted."
    exit 1
fi

echo ""
echo "New docker image \"${IMAGE_NAME}\" created with version \"latest\" and save to file \"${IMAGE_NAME}.tar\""
echo "Process terminated successfully."
exit 0