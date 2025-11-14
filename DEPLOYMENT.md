# Deployment Guide: Lace Up for Kids

This guide walks you through deploying the Lace Up for Kids website to Vercel and connecting it to GitHub for automatic deployments.

## Prerequisites

- A GitHub account
- A Vercel account (free tier is fine)
- Your SMTP credentials ready (for contact form)

## Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Lace Up for Kids website"
```

2. **Create a new repository on GitHub**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `lace-up-for-kids` (or your preferred name)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push your code**:
```bash
git remote add origin https://github.com/yourusername/lace-up-for-kids.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Import from GitHub (Recommended)

1. **Sign in to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import your repository**:
   - Click "Add New..." → "Project"
   - Find and select your `lace-up-for-kids` repository
   - Click "Import"

3. **Configure the project**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - Click "Deploy"

4. **Wait for deployment**:
   - Vercel will build and deploy your site
   - This usually takes 1-2 minutes
   - You'll get a URL like `lace-up-for-kids.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Follow the prompts**:
   - Link to existing project or create new
   - Confirm settings
   - Deploy!

## Step 3: Configure Environment Variables

1. **Go to your project in Vercel dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add each variable**:

| Variable | Value | Example |
|----------|-------|---------|
| `SMTP_HOST` | Your SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | Your SMTP username | `your-email@gmail.com` |
| `SMTP_PASS` | Your SMTP password/app password | `your-app-password` |
| `EMAIL_TO` | Where to send contact form emails | `info@laceupforkids.org` |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL | `https://lace-up-for-kids.vercel.app` |

4. **Select environments**:
   - Check "Production"
   - Check "Preview" (optional, for PR previews)
   - Check "Development" (optional)

5. **Redeploy**:
   - After adding variables, go to "Deployments"
   - Click the three dots on the latest deployment
   - Click "Redeploy" to apply new environment variables

## Step 4: Custom Domain (Optional)

1. **Go to Settings → Domains**
2. **Add your domain** (e.g., `laceupforkids.org`)
3. **Follow DNS configuration instructions**:
   - Add the CNAME or A record as shown
   - Wait for DNS propagation (can take up to 48 hours)
4. **SSL certificate** will be automatically provisioned by Vercel

## Step 5: Verify Deployment

1. **Visit your site**: `https://your-project.vercel.app`
2. **Test the contact form**:
   - Fill out and submit the form
   - Check that you receive the email at `EMAIL_TO`
3. **Test navigation**:
   - Click all nav links
   - Verify smooth scrolling
   - Test on mobile (responsive design)

## Automatic Deployments

Once connected to GitHub, Vercel will automatically:
- ✅ Deploy on every push to `main` branch
- ✅ Create preview deployments for pull requests
- ✅ Run builds automatically
- ✅ Show build logs and errors

## Troubleshooting

### Contact Form Not Working

1. **Check environment variables** are set correctly in Vercel
2. **Verify SMTP credentials** are correct
3. **Check Vercel function logs**:
   - Go to your deployment
   - Click "Functions" tab
   - Check `/api/contact` logs for errors

### Build Failures

1. **Check build logs** in Vercel dashboard
2. **Common issues**:
   - Missing dependencies (check `package.json`)
   - TypeScript errors (run `npm run build` locally first)
   - Environment variable issues

### Images Not Loading

1. **Ensure images are in `/public` folder**
2. **Check image paths** in components
3. **Verify Next.js Image component** is used correctly

## Updating the Site

1. **Make changes locally**
2. **Test with `npm run dev`**
3. **Commit and push**:
```bash
git add .
git commit -m "Your update message"
git push
```
4. **Vercel automatically deploys** the new version

## Monitoring

- **Analytics**: Enable Vercel Analytics in project settings
- **Logs**: View function logs in Vercel dashboard
- **Performance**: Check Core Web Vitals in Vercel dashboard

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Support**: Available in dashboard

---

**Your site is now live! 🎉**

Share your URL: `https://your-project.vercel.app`

