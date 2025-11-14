# Customization Guide: Where to Make Changes

This guide shows you exactly where to look for areas that need customization in your Lace Up for Kids website.

## 🔍 Quick Search Method

**Search for `TODO` in your codebase** - All placeholder content is marked with `TODO` comments.

---

## 📁 Files That Need Changes

### 1. **Logo & Branding**

#### `components/Hero.tsx` (Line 35)
- **Location**: Hero section logo placeholder
- **Change**: Replace the "LU" text with your actual logo image
- **File to add**: `/public/assets/logo.pdf` or convert to PNG/JPG

#### `components/Navigation.tsx` (Line 63)
- **Location**: Navigation bar logo
- **Change**: Replace logo placeholder with actual logo

#### `components/Footer.tsx` (Line 21)
- **Location**: Footer logo
- **Change**: Replace logo placeholder with actual logo

---

### 2. **Team Information**

#### `components/WhoWeAre.tsx` (Lines 7-38)
- **Location**: Team members array
- **Changes needed**:
  - Update team member names (currently: Alex Martinez, Jordan Chen, Sam Taylor)
  - Update roles
  - Replace placeholder bios with real information
  - Update social media links (currently all set to `#`)
  - Optional: Add actual headshot images

**Current structure:**
```typescript
const teamMembers = [
  {
    name: 'Alex Martinez',        // ← Change this
    role: 'Founder & Director',    // ← Change this
    bio: '...',                    // ← Change this
    social: {
      twitter: '#',                // ← Add real URLs
      linkedin: '#',               // ← Add real URLs
    },
  },
  // ... more members
]
```

---

### 3. **Donation Functionality**

#### `components/Hero.tsx` (Line 8-9)
- **Location**: "Donate Now" button handler
- **Change**: Replace alert with actual donation modal/flow
- **Current**: Shows alert with email info

#### `components/HowItWorks.tsx` (Line 44-45)
- **Location**: "Get Involved" button
- **Change**: Replace alert with actual donation functionality

#### `components/Footer.tsx` (Line 5-6)
- **Location**: Footer "Donate Now" button
- **Change**: Replace alert with actual donation functionality

---

### 4. **Contact Information**

#### `components/Footer.tsx` (Line 72)
- **Location**: Contact email
- **Current**: `info@laceupforkids.org`
- **Change**: Update if different

#### `components/Footer.tsx` (Line 72)
- **Location**: Physical address
- **Current**: `[Your City, State]`
- **Change**: Add actual address

---

### 5. **Social Media Links**

#### `components/Footer.tsx` (Lines 80-110)
- **Location**: Social media icons in footer
- **Current**: All links point to `#`
- **Change**: Add real social media URLs:
  - Twitter/X
  - Instagram
  - Facebook

#### `components/WhoWeAre.tsx` (Lines 13-16, 23-26, 33-36)
- **Location**: Team member social links
- **Change**: Replace `#` with actual social media profiles

---

### 6. **GitHub Repository URL**

#### `components/Footer.tsx` (Line 120)
- **Location**: "View on GitHub" link
- **Current**: `https://github.com/yourusername/lace-up-for-kids`
- **Change**: Update with your actual GitHub repository URL

---

### 7. **Site Metadata**

#### `app/layout.tsx` (Line 13)
- **Location**: Open Graph URL
- **Current**: `https://laceupforkids.org`
- **Change**: Update with your actual Vercel URL or domain

---

### 8. **Colors & Styling**

#### `tailwind.config.js`
- **Location**: Color palette configuration
- **Change**: Customize colors based on your logo/brand
- **Current**: Blue (primary) and red (accent) tones

---

## 🎯 Priority Checklist

### High Priority (Essential)
- [ ] Update team member information in `components/WhoWeAre.tsx`
- [ ] Replace logo placeholders in `components/Hero.tsx`, `Navigation.tsx`, `Footer.tsx`
- [ ] Update contact email and address in `components/Footer.tsx`
- [ ] Add real social media links in `components/Footer.tsx`
- [ ] Update GitHub repository URL in `components/Footer.tsx`

### Medium Priority (Important)
- [ ] Replace donation button alerts with actual functionality
- [ ] Update site URL in `app/layout.tsx`
- [ ] Customize colors in `tailwind.config.js`

### Low Priority (Optional)
- [ ] Add team member headshot images
- [ ] Add hero background image
- [ ] Customize rotating belt messages in `components/RotatingBelt.tsx`

---

## 🔎 How to Find All TODOs

**In Cursor/VS Code:**
1. Press `Cmd+Shift+F` (Mac) or `Ctrl+Shift+F` (Windows)
2. Search for: `TODO`
3. Review all results

**Or use terminal:**
```bash
grep -r "TODO" .
```

---

## 📝 File-by-File Summary

| File | Lines to Check | What to Change |
|------|---------------|---------------|
| `components/Hero.tsx` | 8-9, 35 | Donation handler, logo |
| `components/Navigation.tsx` | 41-42, 63 | Donation handler, logo |
| `components/Footer.tsx` | 5-6, 21, 72, 80-110, 120 | Donation, logo, contact, social links, GitHub URL |
| `components/WhoWeAre.tsx` | 7-38 | Team member info, social links |
| `components/HowItWorks.tsx` | 44-45 | Donation handler |
| `app/layout.tsx` | 13 | Site URL metadata |
| `tailwind.config.js` | All | Color customization |

---

## 💡 Pro Tips

1. **Start with content**: Update team info and contact details first
2. **Then branding**: Add logos and customize colors
3. **Finally functionality**: Replace alerts with real donation flows
4. **Test as you go**: Run `npm run dev` to see changes live

---

**Need help?** All placeholder content is clearly marked with `TODO` comments. Just search for "TODO" in your codebase!

