# ☁️ Cloud Deployment Guide

Follow these steps to deploy your Notes API and Premium Frontend to the cloud for free using **Render** and **Vercel**.

## 1. Prepare Your Code
- Ensure all changes are committed and pushed to a **GitHub Repository**.
- Backend files: `app/`, `Dockerfile`, `requirements.txt`.
- Frontend files: `frontend/` folder.

## 2. Deploy the Backend (Render)
1. Sign in to [Render.com](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. **Settings**:
   - **Name**: `notes-api-backend`
   - **Environment**: `Docker`
5. **Environment Variables**:
   Click **Advanced** and add:
   - `DATABASE_URL`: `postgresql://user:password@hostname:port/db` (Render's default URL is now auto-formatted by the app!)
   - `SECRET_KEY`: `A_LONG_RANDOM_STRING_FOR_SECURITY`
   - `ALLOWED_ORIGINS`: `https://your-frontend-domain.vercel.app` (You can now use a simple comma-separated list)
6. Click **Create Web Service**.

## 3. Deploy the Database (Render Postgres)
1. Click **New +** > **PostgreSQL**.
2. **Name**: `notes-db`
3. Click **Create Database**.
4. Copy the **Internal Database URL** and paste it into the backend's `DATABASE_URL` env variable.

## 4. Deploy the Frontend (Vercel)
1. Sign in to [Vercel.com](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your GitHub repository.
4. **Edit Root Directory**: Set to `frontend`.
5. **Framework Preset**: `Other`.
6. **Deployment**:
   - Vercel will automatically detect `index.html` and deploy it as a static site.
7. **Important**: After deployment, copy your Vercel URL and update the `ALLOWED_ORIGINS` in your Render backend settings.

## 5. Final Integration
- Open `frontend/app.js`.
- Update the `API_URL` to point to your Render backend URL (e.g., `https://notes-api-backend.onrender.com/api/v1`).
- Push the change to GitHub, and Vercel will auto-redeploy.

---
✅ **Your app is now live!**
- Backend: `https://your-backend.onrender.com/docs`
- Frontend: `https://your-frontend.vercel.app`
