// ===== STORAGE MANAGER CLASS =====
class StorageManager {
    constructor() {
        this.storageKey = 'toeicPomodoroData';
        this.lastResetKey = 'lastResetDate';
    }

    saveSettings(settings) {
        try {
            const data = this.loadData();
            data.settings = settings;
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    loadSettings() {
        const data = this.loadData();
        return data.settings || {
            workDuration: 35,
            breakDuration: 10,
            dailyTarget: 11,
            autoStartBreak: false,
            soundNotifications: true
        };
    }

    saveDailyProgress(progress) {
        try {
            const data = this.loadData();
            data.progress = progress;
            data.lastUpdate = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving progress:', error);
            return false;
        }
    }

    loadDailyProgress() {
        this.checkAndResetDaily();
        const data = this.loadData();
        return data.progress || {
            completedSessions: 0,
            studyTime: 0,
            breakTime: 0
        };
    }

    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error loading data:', error);
            return {};
        }
    }

    checkAndResetDaily() {
        try {
            const lastReset = localStorage.getItem(this.lastResetKey);
            const today = new Date().toDateString();

            if (lastReset !== today) {
                this.resetDailyProgress();
                localStorage.setItem(this.lastResetKey, today);
            }
        } catch (error) {
            console.error('Error checking daily reset:', error);
        }
    }

    resetDailyProgress() {
        try {
            const data = this.loadData();
            data.progress = {
                completedSessions: 0,
                studyTime: 0,
                breakTime: 0
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error resetting progress:', error);
            return false;
        }
    }
}

// ===== POMODORO TIMER CLASS =====
class PomodoroTimer {
    constructor() {
        this.storage = new StorageManager();
        const settings = this.storage.loadSettings();

        this.workDuration = settings.workDuration * 60;
        this.breakDuration = settings.breakDuration * 60;
        this.currentTime = this.workDuration;
        this.isRunning = false;
        this.isWorkSession = true;
        this.interval = null;
        this.settings = settings;

        // Load progress
        const progress = this.storage.loadDailyProgress();
        this.completedSessions = progress.completedSessions;
        this.totalStudyTime = progress.studyTime;
        this.totalBreakTime = progress.breakTime;

        this.initializeUI();
        this.attachEventListeners();
    }

    initializeUI() {
        this.timerDisplay = document.getElementById('timerDisplay');
        this.sessionType = document.getElementById('sessionType');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');

        this.updateDisplay();
        this.updateProgressDisplay();
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;

            this.interval = setInterval(() => this.tick(), 1000);
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;

            clearInterval(this.interval);
        }
    }

    reset() {
        this.pause();
        this.currentTime = this.isWorkSession ? this.workDuration : this.breakDuration;
        this.updateDisplay();
    }

    tick() {
        if (this.currentTime > 0) {
            this.currentTime--;
            this.updateDisplay();
        } else {
            this.onComplete();
        }
    }

    onComplete() {
        this.pause();

        // Update statistics
        if (this.isWorkSession) {
            this.completedSessions++;
            this.totalStudyTime += this.workDuration;
        } else {
            this.totalBreakTime += this.breakDuration;
        }

        // Save progress
        this.storage.saveDailyProgress({
            completedSessions: this.completedSessions,
            studyTime: this.totalStudyTime,
            breakTime: this.totalBreakTime
        });

        // Play notification sound
        if (this.settings.soundNotifications) {
            this.playNotificationSound();
        }

        // Show notification
        const message = this.isWorkSession
            ? '✅ Work session complete! Time for a break.'
            : '✅ Break complete! Ready for another session?';
        showNotification(message, 'success');

        // Switch session type
        this.isWorkSession = !this.isWorkSession;
        this.currentTime = this.isWorkSession ? this.workDuration : this.breakDuration;

        this.updateDisplay();
        this.updateProgressDisplay();

        // Auto-start break if enabled
        if (!this.isWorkSession && this.settings.autoStartBreak) {
            setTimeout(() => this.start(), 2000);
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;

        this.timerDisplay.textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        this.sessionType.textContent = this.isWorkSession ? 'WORK SESSION' : 'BREAK TIME';
        this.sessionType.className = this.isWorkSession ? '' : 'break';

        // Update document title
        document.title = `${this.timerDisplay.textContent} - ${this.sessionType.textContent}`;
    }

    updateProgressDisplay() {
        // Update session count
        const sessionCount = document.getElementById('sessionCount');
        sessionCount.textContent = `${this.completedSessions}/${this.settings.dailyTarget}`;

        // Update progress dots
        const progressDots = document.getElementById('progressDots');
        progressDots.innerHTML = '';

        for (let i = 0; i < this.settings.dailyTarget; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (i < this.completedSessions) {
                dot.classList.add('completed');
            }
            progressDots.appendChild(dot);
        }

        // Update study stats
        const studyHours = Math.floor(this.totalStudyTime / 3600);
        const studyMinutes = Math.floor((this.totalStudyTime % 3600) / 60);
        document.getElementById('studyTime').textContent = `${studyHours}h ${studyMinutes}m`;

        const breakHours = Math.floor(this.totalBreakTime / 3600);
        const breakMinutes = Math.floor((this.totalBreakTime % 3600) / 60);
        document.getElementById('breakTime').textContent = `${breakHours}h ${breakMinutes}m`;
    }

    playNotificationSound() {
        // Create a simple beep using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.error('Error playing notification sound:', error);
        }
    }

    updateSettings(newSettings) {
        this.settings = newSettings;
        this.workDuration = newSettings.workDuration * 60;
        this.breakDuration = newSettings.breakDuration * 60;

        if (!this.isRunning) {
            this.currentTime = this.isWorkSession ? this.workDuration : this.breakDuration;
            this.updateDisplay();
        }

        this.updateProgressDisplay();
    }
}

// ===== YOUTUBE CONTROLLER CLASS =====
class YouTubeController {
    constructor() {
        this.player = null;
        this.isReady = false;
        this.currentVideoId = null;

        this.initializeUI();
        this.loadYouTubeAPI();
    }

    initializeUI() {
        this.urlInput = document.getElementById('youtubeUrl');
        this.loadBtn = document.getElementById('loadVideoBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeValue = document.getElementById('volumeValue');

        // Attach event listeners
        this.loadBtn.addEventListener('click', () => this.loadVideoFromInput());
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadVideoFromInput();
        });

        this.volumeSlider.addEventListener('input', (e) => {
            const volume = parseInt(e.target.value);
            this.volumeValue.textContent = `${volume}%`;
            if (this.player && this.isReady) {
                this.player.setVolume(volume);
            }
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const url = btn.getAttribute('data-url');
                this.loadVideo(url);
            });
        });
    }

    loadYouTubeAPI() {
        // Check if API is already loaded
        if (window.YT && window.YT.Player) {
            this.onYouTubeIframeAPIReady();
            return;
        }

        // Load YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // API ready callback
        window.onYouTubeIframeAPIReady = () => this.onYouTubeIframeAPIReady();
    }

    onYouTubeIframeAPIReady() {
        this.isReady = true;
    }

    loadVideoFromInput() {
        const url = this.urlInput.value.trim();
        if (url) {
            this.loadVideo(url);
        } else {
            showNotification('Please enter a YouTube URL', 'error');
        }
    }

    loadVideo(url) {
        const videoId = this.extractVideoId(url);

        if (!videoId) {
            showNotification('Invalid YouTube URL', 'error');
            return;
        }

        if (!this.isReady) {
            showNotification('YouTube player is loading...', 'warning');
            setTimeout(() => this.loadVideo(url), 1000);
            return;
        }

        this.currentVideoId = videoId;

        if (this.player) {
            this.player.loadVideoById(videoId);
        } else {
            this.player = new YT.Player('playerContainer', {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 1,
                    modestbranding: 1,
                    rel: 0
                },
                events: {
                    onReady: (event) => {
                        event.target.setVolume(parseInt(this.volumeSlider.value));
                        showNotification('Video loaded successfully', 'success');
                    },
                    onError: (event) => {
                        showNotification('Error loading video', 'error');
                        console.error('YouTube player error:', event.data);
                    }
                }
            });
        }

        this.urlInput.value = '';
    }

    extractVideoId(url) {
        // Handle various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /^([a-zA-Z0-9_-]{11})$/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    }

    play() {
        if (this.player && this.isReady) {
            this.player.playVideo();
        }
    }

    pause() {
        if (this.player && this.isReady) {
            this.player.pauseVideo();
        }
    }

    setVolume(volume) {
        if (this.player && this.isReady) {
            this.player.setVolume(volume);
            this.volumeSlider.value = volume;
            this.volumeValue.textContent = `${volume}%`;
        }
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ===== SETTINGS MANAGER =====
class SettingsManager {
    constructor(timer) {
        this.timer = timer;
        this.storage = new StorageManager();
        this.initializeUI();
        this.loadSettings();
    }

    initializeUI() {
        this.workDurationInput = document.getElementById('workDuration');
        this.breakDurationInput = document.getElementById('breakDuration');
        this.dailyTargetInput = document.getElementById('dailyTarget');
        this.autoStartBreakCheckbox = document.getElementById('autoStartBreak');
        this.soundNotificationsCheckbox = document.getElementById('soundNotifications');
        this.saveBtn = document.getElementById('saveSettingsBtn');

        this.saveBtn.addEventListener('click', () => this.saveSettings());
    }

    loadSettings() {
        const settings = this.storage.loadSettings();

        this.workDurationInput.value = settings.workDuration;
        this.breakDurationInput.value = settings.breakDuration;
        this.dailyTargetInput.value = settings.dailyTarget;
        this.autoStartBreakCheckbox.checked = settings.autoStartBreak;
        this.soundNotificationsCheckbox.checked = settings.soundNotifications;
    }

    saveSettings() {
        const settings = {
            workDuration: parseInt(this.workDurationInput.value),
            breakDuration: parseInt(this.breakDurationInput.value),
            dailyTarget: parseInt(this.dailyTargetInput.value),
            autoStartBreak: this.autoStartBreakCheckbox.checked,
            soundNotifications: this.soundNotificationsCheckbox.checked
        };

        // Validate settings
        if (settings.workDuration < 1 || settings.workDuration > 60) {
            showNotification('Work duration must be between 1-60 minutes', 'error');
            return;
        }

        if (settings.breakDuration < 1 || settings.breakDuration > 30) {
            showNotification('Break duration must be between 1-30 minutes', 'error');
            return;
        }

        if (settings.dailyTarget < 1 || settings.dailyTarget > 20) {
            showNotification('Daily target must be between 1-20 sessions', 'error');
            return;
        }

        // Save settings
        if (this.storage.saveSettings(settings)) {
            this.timer.updateSettings(settings);
            showNotification('Settings saved successfully!', 'success');
        } else {
            showNotification('Error saving settings', 'error');
        }
    }
}

// ===== UI TOGGLE FUNCTIONS =====
function initializeToggles() {
    // YouTube player toggle
    const togglePlayerBtn = document.getElementById('togglePlayerBtn');
    const youtubeContent = document.getElementById('youtubeContent');

    togglePlayerBtn.addEventListener('click', () => {
        youtubeContent.classList.toggle('hidden');
        togglePlayerBtn.textContent = youtubeContent.classList.contains('hidden') ? '▶' : '▼';
    });

    // Settings toggle
    const toggleSettingsBtn = document.getElementById('toggleSettingsBtn');
    const settingsContent = document.getElementById('settingsContent');

    toggleSettingsBtn.addEventListener('click', () => {
        settingsContent.classList.toggle('hidden');
        toggleSettingsBtn.textContent = settingsContent.classList.contains('hidden') ? '▶' : '▼';
    });

    // Reset progress button
    const resetProgressBtn = document.getElementById('resetProgressBtn');
    resetProgressBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your daily progress?')) {
            const storage = new StorageManager();
            storage.resetDailyProgress();
            location.reload();
        }
    });
}

// ===== INITIALIZE APPLICATION =====
let timer, youtubeController, settingsManager;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    timer = new PomodoroTimer();
    youtubeController = new YouTubeController();
    settingsManager = new SettingsManager(timer);

    // Initialize UI toggles
    initializeToggles();

    // Show welcome message
    showNotification('Welcome! Start your TOEIC study session 🚀', 'success');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// Check for localStorage support
if (!window.localStorage) {
    showNotification('Your browser does not support local storage. Settings will not be saved.', 'warning');
}
