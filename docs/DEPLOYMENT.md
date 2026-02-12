# Deployment Guide

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment.

### Pipeline Stages

1. **🧪 Test** - Runs on every push/PR
   - Installs dependencies
   - Generates Prisma client
   - Runs all tests (vitest)
   - Runs linter

2. **🔨 Build** - Runs on main branch only (after tests pass)
   - Builds Next.js production bundle
   - Builds Docker image
   - Pushes to Google Container Registry

3. **🚀 Deploy** - Runs after successful build
   - Deploys to Google Cloud Run
   - Configures service settings

4. **✅ Verify** - Post-deployment checks
   - Health check on main URL
   - API endpoint verification

### Required GitHub Secrets

Set these in: `Repository Settings → Secrets and variables → Actions`

| Secret | Description | How to get it |
|--------|-------------|---------------|
| `GCP_PROJECT_ID` | Google Cloud project ID | From GCP Console |
| `GCP_SA_KEY` | Service account JSON key | See below |

### Creating the Service Account Key

1. Go to [GCP Console → IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)

2. Create a new service account or use existing one

3. Grant these roles:
   - `Cloud Run Admin`
   - `Storage Admin` (for Container Registry)
   - `Service Account User`

4. Create a JSON key:
   - Click on the service account
   - Go to "Keys" tab
   - Add Key → Create new key → JSON
   - Download the JSON file

5. Add to GitHub:
   - Copy the entire JSON file contents
   - Paste as the value for `GCP_SA_KEY` secret

### Manual Deployment

If needed, deploy manually:

```bash
# Build and push Docker image
docker build -t gcr.io/PROJECT_ID/elvait:latest .
docker push gcr.io/PROJECT_ID/elvait:latest

# Deploy to Cloud Run
gcloud run deploy elvait \
  --image gcr.io/PROJECT_ID/elvait:latest \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 3002
```

### Monitoring Deployments

- **GitHub Actions**: Check the "Actions" tab in the repository
- **Cloud Run Console**: [console.cloud.google.com/run](https://console.cloud.google.com/run)
- **Build Logs**: Click on any workflow run to see detailed logs

### Troubleshooting

#### Build fails with "prisma generate" error
- Ensure `prisma` folder is copied in Dockerfile
- Check that `DATABASE_URL` is set

#### Deploy fails with permission error
- Verify service account has required roles
- Re-download and update the `GCP_SA_KEY` secret

#### Health check fails
- Check Cloud Run logs for startup errors
- Verify the service is running: `gcloud run services list`
