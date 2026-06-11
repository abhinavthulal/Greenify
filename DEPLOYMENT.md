# Greenify Batch - Deployment Guide

## Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Set up Supabase project and database
- [ ] Create `.env.local` with Supabase credentials
- [ ] Test locally: `npm run dev`
- [ ] Build production: `npm run build`
- [ ] Deploy to Cloudflare Pages or GitHub Pages

## Detailed Setup Instructions

### 1. Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit http://localhost:5173

### 2. Supabase Setup

1. Go to https://supabase.com and create an account
2. Create a new project (choose a region closest to your users)
3. Wait for project to initialize
4. Go to SQL Editor and run the schema from `supabase-schema.sql`
5. Navigate to Settings → API
6. Copy your:
   - Project URL (VITE_SUPABASE_URL)
   - Anon Public Key (VITE_SUPABASE_ANON_KEY)

### 3. Environment Variables

Create `.env.local` in project root:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-long-api-key
```

### 4. Test Build

```bash
npm run build
npm run preview
```

Visit http://localhost:4173 to test production build

## Deployment Methods

### Option A: Cloudflare Pages (Recommended)

**Pros**: Fast, free, global CDN, easy setup
**Steps**:

1. Push code to GitHub
2. Go to https://pages.cloudflare.com
3. Connect your GitHub repository
4. Select branch: `main`
5. Build command: `npm run build`
6. Build output directory: `dist`
7. Add environment variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
8. Deploy

**Custom Domain**: Add in Cloudflare dashboard

### Option B: GitHub Pages

**Pros**: Free with GitHub, simple
**Steps**:

1. Update `vite.config.js` with base path:
```javascript
export default defineConfig({
  base: '/greenify-batch/',
  // ...
})
```

2. Build:
```bash
npm run build
```

3. Push `dist` folder to `gh-pages` branch or configure in GitHub Actions

4. Enable Pages in repository settings

### Option C: Vercel

**Pros**: Zero-config, automatic deployments
**Steps**:

1. Push to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables
5. Deploy (automatic on every push)

### Option D: Netlify

**Pros**: Generous free tier, drag-and-drop
**Steps**:

1. Push to GitHub
2. Go to https://netlify.com
3. Connect GitHub
4. Select repository and branch
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Add environment variables
8. Deploy

## Production Checklist

Before going live:

- [ ] Test all features locally
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify Supabase connection works
- [ ] Test image upload and processing
- [ ] Verify auto-downloads work
- [ ] Check counters update correctly
- [ ] Test error scenarios
- [ ] Set custom domain
- [ ] Configure DNS if needed
- [ ] Set up SSL certificate (automatic on most platforms)
- [ ] Test in production environment

## Monitoring

### Check Processing Performance
- Monitor image processing time
- Check average file sizes
- Track error rates

### Monitor Supabase
- Check database size
- Monitor query performance
- Review RLS policies

### Analytics
- Track page views (Cloudflare Analytics for Pages)
- Monitor upload patterns
- Check for error spikes

## Troubleshooting

### Images not processing after deployment?
- Verify Supabase credentials in environment variables
- Check browser console for errors
- Ensure Web Workers are enabled
- Test with small image first

### Counters not updating?
- Verify Supabase URL and key
- Check RLS policies on database tables
- Ensure site_stats table has initial row with id=1
- Check browser network tab for API calls

### Large file sizes?
- Verify PNG compression is working
- Check original image resolution
- Consider adding image resizing

## Scaling

For high traffic (>100k images/day):

1. **Consider**:
   - Supabase auto-scaling
   - Additional caching layers
   - CDN optimization
   
2. **Future improvements**:
   - Server-side image processing for lower-end devices
   - Redis caching for counters
   - Background job queue for processing

## Security

- Images never leave user's browser
- Only counters stored server-side
- No personal data collected
- All connections use HTTPS
- RLS policies prevent unauthorized access

## Maintenance

### Regular Tasks
- Monitor Supabase usage
- Check error logs
- Update dependencies: `npm update`
- Test functionality monthly

### Backup
- Supabase automatically backs up data
- Keep code backed up on GitHub

## Support & Monitoring

Set up alerts for:
- High error rates
- Supabase downtime
- Unusual traffic patterns
- Database quota exceeded

---

For more help: Check README.md or GitHub issues
