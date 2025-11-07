# 🎯 TOEIC Pomodoro Timer

A modern, feature-rich Pomodoro timer web application specifically designed for TOEIC learners. Combines focused study sessions with YouTube music integration and comprehensive progress tracking.

![TOEIC Pomodoro Timer](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### Core Timer Functionality
- **35-minute work sessions** and **10-minute breaks** (fully customizable)
- Start, pause, and reset controls
- Visual countdown display with MM:SS format
- Automatic session switching
- Audio notifications on completion

### YouTube Music Integration
- Embed YouTube videos directly in the app
- Quick preset buttons (Lo-fi Hip Hop, Classical Study, Nature Sounds)
- Custom URL input for any YouTube video
- Volume control slider
- Collapsible player interface

### Progress Tracking
- Daily session counter with visual progress dots
- Target: 11 sessions per day (customizable 1-20)
- Study time and break time statistics
- Automatic daily reset at midnight
- Manual progress reset option

### Persistent Storage
- All settings saved to localStorage
- Daily progress persists across browser sessions
- Settings include work/break durations, auto-start, and notifications

### Modern UI/UX
- Clean, responsive design
- Mobile-friendly (320px minimum width)
- Smooth animations and transitions
- Touch-friendly buttons (44px minimum)
- Accessible keyboard navigation

## 🚀 Quick Start

### Option 1: Clone and Open Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/toeic-pomodoro-timer.git

# Navigate to the directory
cd toeic-pomodoro-timer

# Open in your browser
open index.html
# or
python3 -m http.server 8000  # Then visit http://localhost:8000
```

### Option 2: Deploy to GitHub Pages

1. Fork this repository
2. Go to repository Settings → Pages
3. Select branch `main` and folder `/root`
4. Click Save
5. Your app will be available at `https://yourusername.github.io/toeic-pomodoro-timer`

## 📖 How to Use

### Starting a Study Session

1. **Start Timer**: Click the "Start" button to begin your 35-minute work session
2. **Focus**: Study TOEIC materials while the timer counts down
3. **Break**: When the timer completes, take your 10-minute break
4. **Repeat**: Continue until you reach your daily goal (default: 11 sessions)

### YouTube Music Setup

1. **Use Presets**: Click one of the preset buttons (Lo-fi, Classical, Nature)
2. **Or Custom URL**:
   - Copy any YouTube video URL
   - Paste into the input field
   - Click "Load" button
3. **Adjust Volume**: Use the slider to set your preferred volume

### Customizing Settings

1. Click the "Settings" dropdown
2. Adjust the following:
   - **Work Duration**: 1-60 minutes
   - **Break Duration**: 1-30 minutes
   - **Daily Target**: 1-20 sessions
   - **Auto-start Breaks**: Toggle on/off
   - **Sound Notifications**: Toggle on/off
3. Click "Save Settings"

### Tracking Progress

- Progress dots show completed sessions (filled) vs remaining (empty)
- Study Time and Break Time stats update automatically
- Reset progress manually with "Reset Daily Progress" button
- Progress automatically resets at midnight

## 🛠️ Technical Details

### File Structure

```
toeic-pomodoro-timer/
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── script.js       # Application logic and functionality
└── README.md       # Documentation (this file)
```

### Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks or dependencies
- **YouTube IFrame API**: Video embedding and control
- **localStorage**: Data persistence
- **Web Audio API**: Notification sounds

### Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Key Classes

1. **PomodoroTimer**: Manages timer state and countdown logic
2. **YouTubeController**: Handles YouTube API and video playback
3. **StorageManager**: Manages localStorage operations
4. **SettingsManager**: Handles settings UI and validation

## 🎨 Customization

### Changing Color Scheme

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-blue: #3B82F6;
    --success-green: #10B981;
    --warning-orange: #F59E0B;
    /* ... more colors ... */
}
```

### Modifying Default Settings

Edit the default values in `StorageManager.loadSettings()` in `script.js`:

```javascript
return data.settings || {
    workDuration: 35,      // Change default work time
    breakDuration: 10,     // Change default break time
    dailyTarget: 11,       // Change default daily goal
    autoStartBreak: false,
    soundNotifications: true
};
```

### Adding More Presets

Add more preset buttons in `index.html`:

```html
<button class="preset-btn" data-url="YOUR_YOUTUBE_URL">
    Preset Name
</button>
```

## 📱 Mobile Usage

The app is fully responsive and works great on mobile devices:

- Timer display scales appropriately
- Touch-friendly buttons (minimum 44px)
- Optimized layout for small screens
- Swipe-friendly controls

## 🔒 Privacy & Security

- **No server required**: Runs entirely in your browser
- **No data collection**: All data stored locally on your device
- **No external dependencies**: Only uses YouTube IFrame API
- **No tracking**: Your study sessions are private

## 🐛 Troubleshooting

### YouTube Videos Not Loading

- Check your internet connection
- Ensure the video URL is valid and not region-restricted
- Try refreshing the page
- Check browser console for errors

### Settings Not Saving

- Ensure localStorage is enabled in your browser
- Check if you're in private/incognito mode (localStorage may be disabled)
- Try clearing browser cache and reloading

### Timer Not Accurate

- Browser may throttle background timers when tab is inactive
- Keep the tab active for most accurate timing
- Check if browser has power-saving mode enabled

### Audio Notifications Not Playing

- Check browser audio permissions
- Ensure "Sound Notifications" is enabled in settings
- Some browsers require user interaction before playing audio

## 🎓 TOEIC Study Tips

### Recommended Study Plan

1. **Morning Session**: 4 work sessions (2h 20m study + 40m break)
2. **Afternoon Session**: 4 work sessions (2h 20m study + 40m break)
3. **Evening Session**: 3 work sessions (1h 45m study + 30m break)

**Total**: 11 sessions = ~6.5 hours of focused study time

### Best Practices

- Use work sessions for intensive practice (reading, listening)
- Use breaks for light review or physical activity
- Stay consistent with daily targets
- Track your progress weekly
- Adjust session length based on your focus capacity

## 📝 Future Enhancements

Potential features for future versions:

- [ ] Long break after 4 sessions
- [ ] Weekly/monthly statistics
- [ ] Task list integration
- [ ] Multiple timer presets
- [ ] Desktop notifications
- [ ] Offline mode (PWA)
- [ ] Data export/import
- [ ] Pomodoro streak tracking
- [ ] Integration with study apps

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - you are free to use, modify, and distribute this software.

## 🙏 Acknowledgments

- Inspired by the Pomodoro Technique® by Francesco Cirillo
- YouTube music presets curated for optimal focus
- Built with love for TOEIC learners worldwide

## 📧 Contact

For questions, suggestions, or feedback:

- Create an issue in the GitHub repository
- Share your success stories!

---

**Happy Studying! 🎯 Stay focused, stay consistent, achieve your TOEIC goals! 🚀**
