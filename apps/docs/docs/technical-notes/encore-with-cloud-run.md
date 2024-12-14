---
sidebar_position: 11
---

# Using encore-dev with Cloud Run

Few notes

- Cloud Run only allow to run API, does not support the dashboard because it's a serverless solution
- The dashboard is a tool build by encore platform with require a self-hosted infrastructure like VM or Kubernetes cluster

## Commands

```
cd apps/backend

docker build --no-cache -t shinabr2/sworld-backend:1.3.0 .
docker push shinabr2/sworld-backend:1.3.0
gcloud run deploy sworld-backend \
  --image docker.io/shinabr2/sworld-backend:1.3.0 \
  --platform managed \
  --port 4000 \
  --region asia-southeast1 \
  --allow-unauthenticated
```
