# LeaseLens - Vercel Deployment Guide

## Project Structure

```
multi-page-loan-app/
├── frontend/          # React + Vite + TypeScript + Tailwind CSS
│   ├── src/          # Source code
│   ├── dist/         # Build output (auto-generated)
│   ├── package.json  # Frontend dependencies
│   └── vite.config.ts # Vite configuration
├── backend/          # FastAPI + Python
│   ├── main.py       # FastAPI application
│   ├── database.py   # Database connection
│   ├── requirements.txt # Python dependencies
│   └── .env          # Environment variables (not in git)
├── vercel.json       # Vercel deployment configuration
└── DEPLOYMENT.md     # This file
```

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional): `npm i -g vercel`
3. **Supabase Account**: For PostgreSQL database
4. **GitHub Account**: For repository hosting

## Deployment Steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Vercel deployment ready"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Connect to Vercel

**Option A: Via Vercel Dashboard**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`

**Option B: Via Vercel CLI**
```bash
vercel login
vercel
```

### 3. Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
SUPABASE_DB_HOST=your-supabase-host.supabase.co
SUPABASE_DB_PASSWORD=your-database-password
SUPABASE_DB_PORT=5432
SUPABASE_DB_USER=postgres
SUPABASE_DB_NAME=postgres
```

### 4. Deploy

Vercel will automatically deploy on every push to main branch.

Manual deployment:
```bash
vercel --prod
```

## API Endpoints

All API endpoints are prefixed with `/api/`:

- `GET /api/` - Health check
- `GET /api/health` - Detailed health check with database status
- `POST /api/rental-submissions` - Create rental submission
- `GET /api/rental-submissions` - Get all submissions (with optional filtering)

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on: http://localhost:5173

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Runs on: http://localhost:8000

### Full Stack (with proxy)
The frontend Vite config includes a proxy to forward `/api` requests to the backend during local development.

## Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your database credentials from Settings → Database
3. Run the schema from `backend/schema.sql` in Supabase SQL Editor
4. Update environment variables with your credentials

## Build Configuration

### Frontend Build
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Output**: `frontend/dist/`

### Backend Build
- **Framework**: FastAPI
- **Runtime**: Python 3.9
- **Database**: PostgreSQL (via Supabase)

## Troubleshooting

### Build Fails
- Check Node.js version (recommended: 18+)
- Run `npm install` in frontend directory
- Check for TypeScript errors: `npm run build`

### API Not Working
- Verify environment variables are set in Vercel
- Check Supabase database is accessible
- Review Vercel function logs

### Database Connection Issues
- Ensure Supabase project is not paused
- Check database credentials are correct
- Verify IP is allowed in Supabase settings

## Production Checklist

- [x] Frontend builds successfully
- [x] Backend code is valid
- [x] API routes prefixed with `/api/`
- [x] Vercel configuration created
- [x] Environment variables documented
- [ ] Supabase database created
- [ ] Environment variables set in Vercel
- [ ] Domain configured (optional)

## Support

For issues or questions, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Supabase Documentation](https://supabase.com/docs)