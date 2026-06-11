# Greenify Batch

A single-page web tool that lets users batch upload up to 10 images, automatically convert them into a green-shaded style, remove white and near-white backgrounds, compress the result under 500 KB, and download each image individually as PNG with the original filename plus `green` appended.

## Features

✨ **Core Features:**
- Upload or paste up to 10 images at once
- Automatic conversion to green shades (preserves depth with dark/medium/light green)
- Intelligent white background removal while preserving text and technical details
- Automatic compression under 500 KB
- Instant PNG download with `green` suffix appended to filename
- Real-time progress tracking
- Live queue status display
- Side-by-side before/after preview
- Anonymous usage counters (photos today, total, visitors)

🎯 **Use Cases:**
- Technical diagrams and flowcharts
- Circuit diagrams and electronics schematics
- Code screenshots and examples
- Scanned documents and handwritten notes
- Educational material preparation

## Tech Stack

- **Frontend:** React 18 + Vite + TailwindCSS
- **Image Processing:** Canvas API + Web Workers (browser-side, no server)
- **Backend:** Supabase (lightweight counters only)
- **Deployment:** Cloudflare Pages + Supabase

## Project Structure

```
greenify/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── UploadArea.jsx
│   │   ├── QueueStatus.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── Preview.jsx
│   │   ├── Statistics.jsx
│   │   ├── Instructions.jsx
│   │   ├── ErrorAlert.jsx
│   │   └── Footer.jsx
│   ├── utils/
│   │   ├── supabase.js           (Supabase client)
│   │   ├── db.js                  (Database operations)
│   │   └── imageProcessor.js      (Image processing utilities)
│   ├── workers/
│   │   └── imageWorker.js         (Web Worker for pixel processing)
│   ├── App.jsx                    (Main application component)
│   ├── main.jsx                   (React entry point)
│   └── index.css                  (Tailwind + custom styles)
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .env.example
```

## Installation

### Prerequisites
- Node.js 16+ and npm
- Supabase account (free tier works)

### Step 1: Clone & Install

```bash
git clone <repo>
cd greenify
npm install
```

### Step 2: Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Create these SQL tables in your Supabase project:

```sql
-- Site-wide statistics
CREATE TABLE site_stats (
  id BIGINT PRIMARY KEY DEFAULT 1,
  total_photos BIGINT DEFAULT 0,
  total_visitors BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily statistics
CREATE TABLE daily_upload_counts (
  date DATE PRIMARY KEY,
  photo_count BIGINT DEFAULT 0
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_upload_counts ENABLE ROW LEVEL SECURITY;

-- Create public read access (anyone can read, no write without auth)
CREATE POLICY "Allow public read access" ON site_stats FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON daily_upload_counts FOR SELECT USING (true);
```

4. Get your API credentials:
   - Go to Settings → API
   - Copy `Project URL` (VITE_SUPABASE_URL)
   - Copy `anon` key (VITE_SUPABASE_ANON_KEY)

5. Create `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Building

```bash
npm run build
```

Output files will be in the `dist/` directory.

## Deployment

### Option 1: Cloudflare Pages (Recommended)

1. Push to GitHub
2. Connect repository to Cloudflare Pages
3. Set build command: `npm run build`
4. Set build output directory: `dist`
5. Add environment variables in Cloudflare dashboard

### Option 2: GitHub Pages

1. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/greenify-batch/',
  // ... rest of config
})
```

2. Deploy:
```bash
npm run build
```

3. Push `dist/` to `gh-pages` branch

## Image Processing Algorithm

### Step 1: Color Conversion
- Analyzes luminance of each pixel
- Dark pixels → Dark Green (#0F7A35)
- Medium pixels → Medium Green (#2F9E44)
- Light pixels → Light Green (#74C69D)

### Step 2: Background Detection
- Identifies near-white pixels (R>230, G>230, B>230)
- Checks for edges using Sobel-like detection
- Preserves white areas connected to text/lines

### Step 3: Background Removal
- Removes background pixels (sets alpha to 0)
- Preserves edges and thin elements
- Outputs transparent PNG

### Step 4: Compression
- Targets <500 KB without quality loss
- Uses PNG compression
- Maintains text sharpness

## Environment Variables

```
VITE_SUPABASE_URL     - Your Supabase project URL
VITE_SUPABASE_ANON_KEY - Your Supabase anonymous key
```

## Performance

- Small/medium images: <2 seconds
- Large images: 5-15 seconds
- Processing happens in browser (no network latency)
- Web Workers prevent UI freezing
- Handles batch of 10 images smoothly

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## Privacy

- ✅ No image storage
- ✅ No server-side processing
- ✅ No login required
- ✅ Only counters stored in backend
- ✅ No personal data collected

## Future Enhancements

- [ ] PDF support
- [ ] Adjustable green intensity slider
- [ ] Batch ZIP download
- [ ] Processing history
- [ ] Drag-and-drop queue reordering
- [ ] OCR-aware text protection
- [ ] Server-side fallback for low-end devices

## Error Handling

The app gracefully handles:
- More than 10 images (shows error)
- Unsupported file types (filtered out)
- Clipboard with no image (shows error)
- Corrupted image files (marks as failed)
- Processing failures (individual retry possible)
- Browser download blocking (automatic retry)

## Development Notes

### Adding More Green Shades

Edit `src/utils/imageProcessor.js` and `src/workers/imageWorker.js`:

```javascript
const GREEN_PALETTE = {
  dark: [15, 122, 53],
  medium: [47, 158, 68],
  light: [116, 198, 157],
  // Add more shades here
}
```

### Adjusting Background Threshold

Edit `src/workers/imageWorker.js`:

```javascript
isNearWhite(r, g, b, threshold = 230) // Change 230 to adjust sensitivity
```

## Troubleshooting

**Images not processing?**
- Check browser console for errors
- Ensure Web Workers are enabled
- Try smaller images first

**Supabase counters not updating?**
- Verify `.env.local` is correct
- Check Supabase project is online
- Ensure RLS policies are set correctly

**Large file sizes?**
- PNG compression is already applied
- For < 500 KB: reducer dimensions slightly
- Check original image resolution

## Contributing

Improvements welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing discussions first

---

Made with ❤️ for technical writers and content creators
