# Lace Up for Kids

A modern, responsive single-page website for Lace Up for Kids, a teen-led nonprofit that collects gently used shoes, trades them for funds, and donates proceeds to Ronald McDonald House.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lace-up-for-kids.git
cd lace-up-for-kids
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your SMTP configuration:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_TO=recipient@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Note for Gmail users:** You'll need to generate an [App Password](https://support.google.com/accounts/answer/185833) instead of using your regular password.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
lace-up-for-kids/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts          # Contact form API endpoint
│   ├── globals.css                # Global styles and Tailwind imports
│   ├── layout.tsx                 # Root layout with metadata
│   └── page.tsx                   # Main page component
├── components/
│   ├── Contact.tsx                # Contact form section
│   ├── Footer.tsx                 # Footer component
│   ├── Hero.tsx                   # Hero section with rotating belt
│   ├── HowItWorks.tsx             # Three-step process section
│   ├── Navigation.tsx             # Fixed navigation bar
│   ├── OurMission.tsx             # Mission statements
│   ├── RotatingBelt.tsx           # Rotating message carousel
│   ├── WhatWeDo.tsx               # What We Do section
│   └── WhoWeAre.tsx               # Team members section
├── public/
│   ├── assets/
│   │   └── logo.pdf               # TODO: Add your logo PDF here
│   └── images/
│       └── hero-pattern.svg       # Background pattern
├── .env.example                   # Example environment variables
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SMTP_HOST` | SMTP server hostname | Yes |
| `SMTP_PORT` | SMTP server port (usually 587 or 465) | Yes |
| `SMTP_USER` | SMTP username/email | Yes |
| `SMTP_PASS` | SMTP password or app password | Yes |
| `EMAIL_TO` | Recipient email for contact form | Yes |
| `NEXT_PUBLIC_SITE_URL` | Full URL of your site (for meta tags) | Optional |

### SMTP Providers

The contact form uses Nodemailer and supports any SMTP provider. Common configurations:

**Gmail:**
- Host: `smtp.gmail.com`
- Port: `587`
- Use an [App Password](https://support.google.com/accounts/answer/185833)

**SendGrid:**
- Host: `smtp.sendgrid.net`
- Port: `587`
- User: `apikey`
- Pass: Your SendGrid API key

**Mailgun:**
- Host: `smtp.mailgun.org`
- Port: `587`
- Use your Mailgun SMTP credentials

## 🎨 Customization

### Logo

1. Place your logo file at `/public/assets/logo.pdf` (or convert to PNG/JPG)
2. Update the logo references in:
   - `components/Navigation.tsx` (line ~30)
   - `components/Hero.tsx` (line ~25)
   - `components/Footer.tsx` (line ~15)

### Colors

Edit `tailwind.config.js` to customize the color palette. The current setup uses:
- Primary colors (blue tones) for main brand elements
- Accent colors (red tones) for highlights
- Neutral grays for text and backgrounds

### Content

All placeholder content is clearly marked with `TODO` comments. Search for "TODO" in the codebase to find areas that need customization:
- Team member bios and photos
- Contact information
- Social media links
- Donation instructions

### Typography

The site uses Inter font from Google Fonts. To change fonts, update `app/layout.tsx` and `tailwind.config.js`.

## 🚢 Deployment

### Deploying to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard (Settings → Environment Variables)
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Other Platforms

This Next.js app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📝 TODO / Customization Checklist

- [ ] Replace logo placeholder with actual logo (`/public/assets/logo.pdf`)
- [ ] Update team member photos in `components/WhoWeAre.tsx`
- [ ] Replace placeholder team bios with real information
- [ ] Update contact email and address
- [ ] Add real social media links
- [ ] Configure SMTP credentials for contact form
- [ ] Update donation button functionality (currently shows alert)
- [ ] Add actual address/location information
- [ ] Update GitHub repository URL in footer
- [ ] Customize color palette in `tailwind.config.js` based on logo
- [ ] Add hero background image (optional)
- [ ] Update meta tags in `app/layout.tsx` with actual site URL

## 🤝 Contributing

This is a teen-led nonprofit project. Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available for use by the Lace Up for Kids organization.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Email functionality via [Nodemailer](https://nodemailer.com/)

---

**Questions?** Contact us at info@laceupforkids.org

