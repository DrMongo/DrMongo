# Inherit from chriswessels/meteor-tupperware image
FROM quay.io/chriswessels/meteor-tupperware

# (optional) Bake runtime options into your image
# ENV MONGO_URL="mongodb://url" MONGO_OPLOG_URL="mongodb://oplog_url" ROOT_URL="http://yourapp.com"

# If using Kubernetes, construct the MONGO_URL based on service variables
# ENTRYPOINT MONGO_URL=mongodb://$MONGO_SERVICE_HOST:$MONGO_SERVICE_PORT/$DATABASE_NAME MONGO_OPLOG_URL=mongodb://$MONGO_SERVICE_HOST:$MONGO_SERVICE_PORT/local sh /tupperware/scripts/start_app.sh
