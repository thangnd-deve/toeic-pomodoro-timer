# 🚀 Deployment Guide

## Quick Local Testing

### Option 1: Direct File Open
Simply double-click `index.html` or run:
```bash
open index.html
```

### Option 2: Python HTTP Server
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then visit: http://localhost:8000

### Option 3: Node.js HTTP Server
```bash
npx http-server -p 8000
```
Then visit: http://localhost:8000

## GitHub Pages Deployment

### Step 1: Create Repository
```bash
cd toeic-pomodoro-timer
git init
git add .
git commit -m "Initial commit: TOEIC Pomodoro Timer"
```

### Step 2: Push to GitHub
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/toeic-pomodoro-timer.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select branch: `main`
5. Select folder: `/ (root)`
6. Click **Save**

### Step 4: Access Your App
Your app will be available at:
```
https://YOUR_USERNAME.github.io/toeic-pomodoro-timer
```

⏱️ **Note**: It may take 1-2 minutes for the site to be published.

## Netlify Deployment (Alternative)

### Drag & Drop Method
1. Go to https://app.netlify.com/drop
2. Drag the entire `toeic-pomodoro-timer` folder
3. Your site will be deployed instantly!

### CLI Method
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd toeic-pomodoro-timer
netlify deploy --prod
```

## Vercel Deployment (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd toeic-pomodoro-timer
vercel --prod
```

## Custom Domain (Optional)

### For GitHub Pages:
1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. Add a `CNAME` file to your repo with your domain:
   ```bash
   echo "yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```
3. Configure DNS settings at your domain provider:
   - Type: CNAME
   - Name: www
   - Value: YOUR_USERNAME.github.io

### For Netlify/Vercel:
1. Go to site settings
2. Add custom domain
3. Follow DNS configuration instructions

## Testing Checklist

Before deploying, test these features:

- [ ] Timer starts, pauses, and resets correctly
- [ ] Work/break sessions alternate automatically
- [ ] YouTube videos load and play
- [ ] Volume control works
- [ ] Settings save and persist
- [ ] Progress tracking updates correctly
- [ ] Notifications appear
- [ ] Responsive design works on mobile
- [ ] All buttons are clickable and functional

## Troubleshooting

### GitHub Pages Shows 404
- Wait 1-2 minutes after enabling Pages
- Check that branch is set to `main` not `master`
- Verify files are in root directory, not a subfolder

### YouTube Not Working
- Check browser console for errors
- Ensure YouTube IFrame API can load (not blocked by firewall)
- Test with different videos

### Settings Not Saving
- Clear browser cache
- Test in different browser
- Check if localStorage is enabled

## Performance Optimization

The app is already optimized with:
- ✅ No external dependencies (except YouTube API)
- ✅ Minimal CSS (~11KB)
- ✅ Efficient JavaScript (~18KB)
- ✅ Fast loading time (<2 seconds)

## Security Considerations

- ✅ No server-side code
- ✅ No user data sent to external servers
- ✅ All data stored locally
- ✅ HTTPS enforced on GitHub Pages

## Updates

To update your deployed app:

```bash
# Make your changes, then:
git add .
git commit -m "Update: description of changes"
git push

# GitHub Pages will automatically update
```

---

**Need help?** Open an issue on the GitHub repository!
