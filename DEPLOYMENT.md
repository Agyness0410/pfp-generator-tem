# Herstory PFP Generator - Deployment Guide

## Local Testing

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5173

3. **Test the Application**
   - Use invitation code: `HERSTORY2024`
   - Test avatar generation and uniqueness validation
   - Test download functionality
   - Test Twitter sharing

## Production Build

1. **Create Production Build**
   ```bash
   npm run build
   ```

2. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Render Deployment

1. **Connect Repository**
   - Create new Web Service on Render
   - Connect your GitHub repository

2. **Configuration**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
   - **Auto-Deploy:** Yes

3. **Environment Variables** (if needed)
   - `NODE_ENV=production`

4. **Custom Domain**
   - In Render dashboard, go to Settings > Custom Domains
   - Add `0xherstory.xyz`
   - Follow DNS configuration instructions

## Features Implemented

✅ Daily invitation code system (5-day validity)
✅ 9 trait categories with rarity levels
✅ Real-time avatar preview with Canvas API
✅ Global uniqueness validation
✅ PNG download functionality
✅ Twitter sharing integration
✅ Responsive design
✅ Automatic logout after download/share
✅ One avatar per user limit

## Security Features

- HTTPS redirect (handled by Render)
- Input validation for invitation codes
- XSS protection through React
- CSP headers (can be configured in Render)

## Usage Notes

- **Invitation Code:** Currently set to `HERSTORY2024`
- **User Capacity:** Designed for 100 users over 5 days
- **Data Storage:** Client-side localStorage for uniqueness validation
- **Asset Serving:** Static files served from public directory

## File Structure

```
src/
├── components/           # React components
├── contexts/            # React contexts (Auth)
├── services/           # Business logic services
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component

public/
└── pfp-input/          # Avatar trait assets organized by category/rarity
```

## Post-Deployment Checklist

- [ ] Test login with invitation code
- [ ] Test all trait categories
- [ ] Verify avatar preview rendering
- [ ] Test uniqueness validation
- [ ] Test download functionality
- [ ] Test Twitter sharing
- [ ] Verify HTTPS redirect
- [ ] Test on mobile devices
- [ ] Monitor for any console errors