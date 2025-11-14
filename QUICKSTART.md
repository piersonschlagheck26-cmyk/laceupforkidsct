# Quick Start Guide

Get your Lace Up for Kids website up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp env.example .env.local
```

Edit `.env.local` with your SMTP credentials. For Gmail:
- Get an [App Password](https://support.google.com/accounts/answer/185833)
- Use `smtp.gmail.com` as host
- Use `587` as port

## 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 4. Customize Content

Search for `TODO` in the codebase to find all placeholder content:
- Team member photos and bios
- Contact information
- Social media links
- Logo replacement
- Donation button functionality

## 5. Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

**That's it!** Your site is ready to customize and deploy. 🎉

