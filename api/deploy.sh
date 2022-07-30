export $(cat .env | xargs)

set -x

gcloud builds submit \
  --tag gcr.io/$GOOGLE_PROJECT_ID/$CLOUD_API_SERVICE \
  --project=$GOOGLE_PROJECT_ID

gcloud run deploy $CLOUD_API_SERVICE \
  --image gcr.io/$GOOGLE_PROJECT_ID/$CLOUD_API_SERVICE \
  --add-cloudsql-instances $INSTANCE_CONNECTION_NAME \
  --update-env-vars INSTANCE_CONNECTION_NAME=$INSTANCE_CONNECTION_NAME,DB_PASS=$DB_PASS,DB_USER=$DB_USER,DB_NAME=$DB_NAME \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --project=$GOOGLE_PROJECT_ID