# How to Push Your Code to GitHub

Follow these steps to push your Lace Up for Kids website to GitHub.

## Prerequisites

Make sure you have Git installed. If you see an error about developer tools, you may need to install Xcode Command Line Tools:

```bash
xcode-select --install
```

Or use one of these alternatives:
- **GitHub Desktop** (GUI app - easier for beginners)
- **GitHub web interface** (upload files directly)

## Method 1: Using Command Line (Terminal)

### Step 1: Initialize Git Repository

Open Terminal in your project folder and run:

```bash
cd /Users/piersonschlagheck/Documents
git init
```

### Step 2: Create a .gitignore (if not already present)

Make sure you have a `.gitignore` file. It should already exist, but verify it includes:
- `node_modules/`
- `.env.local`
- `.next/`
- Other build files

### Step 3: Add All Files

```bash
git add .
```

### Step 4: Make Your First Commit

```bash
git commit -m "Initial commit: Lace Up for Kids website"
```

### Step 5: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `lace-up-for-kids` (or your preferred name)
4. Description: "Website for Lace Up for Kids nonprofit"
5. Choose **Public** or **Private**
6. **DO NOT** check "Initialize with README" (we already have one)
7. Click **"Create repository"**

### Step 6: Connect Your Local Repository to GitHub

After creating the repo, GitHub will show you commands. Use these:

```bash
# Replace 'yourusername' with your actual GitHub username
git remote add origin https://github.com/yourusername/lace-up-for-kids.git
git branch -M main
git push -u origin main
```

**If you're asked for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your GitHub password)
  - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Generate new token with `repo` permissions
  - Copy the token and use it as your password

### Step 7: Verify

Refresh your GitHub repository page - you should see all your files!

---

## Method 2: Using GitHub Desktop (Easier)

### Step 1: Download GitHub Desktop

Download from [desktop.github.com](https://desktop.github.com)

### Step 2: Sign In

Open GitHub Desktop and sign in with your GitHub account

### Step 3: Add Local Repository

1. Click **"File"** → **"Add Local Repository"**
2. Click **"Choose..."** and select your project folder: `/Users/piersonschlagheck/Documents`
3. Click **"Add Repository"**

### Step 4: Commit Your Files

1. You'll see all your files listed
2. Write a commit message: "Initial commit: Lace Up for Kids website"
3. Click **"Commit to main"**

### Step 5: Publish to GitHub

1. Click **"Publish repository"** button (top right)
2. Choose repository name: `lace-up-for-kids`
3. Choose Public or Private
4. Click **"Publish Repository"**

Done! Your code is now on GitHub.

---

## Method 3: Using GitHub Web Interface (No Git Required)

### Step 1: Create Repository on GitHub

1. Go to [github.com](https://github.com) and sign in
2. Click **"+"** → **"New repository"**
3. Name it `lace-up-for-kids`
4. Click **"Create repository"**

### Step 2: Upload Files

1. On the new repository page, click **"uploading an existing file"**
2. Drag and drop all your project files (except `node_modules` and `.env.local`)
3. Write commit message: "Initial commit"
4. Click **"Commit changes"**

**Note:** This method doesn't preserve git history, but it works if you can't install Git.

---

## After Pushing to GitHub

Once your code is on GitHub, you can:

1. **Deploy to Vercel** - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Share your repository** - Others can clone and contribute
3. **Set up automatic deployments** - Vercel will auto-deploy on every push

## Troubleshooting

### "Permission denied" error
- Make sure you're using a Personal Access Token, not your password
- Or set up SSH keys (more advanced)

### "Repository not found" error
- Check that the repository name matches exactly
- Verify you have access to the repository

### "Nothing to commit" message
- Your files might already be committed
- Try `git status` to see what's happening

---

**Need help?** Check GitHub's documentation or use GitHub Desktop for the easiest experience!

