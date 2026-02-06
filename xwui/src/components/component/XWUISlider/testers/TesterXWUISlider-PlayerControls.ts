
        import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISlider } from '../index.ts';
        import { XWUIButton } from '../../XWUIButton/index.ts';
        import { XWUIIcon } from '../../XWUIIcon/index.ts';
        import { XWUISpinner } from '../../XWUISpinner/index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISlider Component Tester - Player Controls',
            desc: 'Video player controls using XWUISlider for timeline, volume, and brightness. All controls use XWUI components.',
            componentName: 'XWUISlider'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Create player container
        const template = document.getElementById('tester-xwuislider-player-controls-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const videoElement = document.getElementById('video-element');
            const controlsOverlay = document.getElementById('controls-overlay');
            const timeDisplay = document.getElementById('time-display');
            const videoWrapper = document.getElementById('video-wrapper');
            const loadingSpinnerContainer = document.getElementById('loading-spinner-container');
            
            // Create loading spinner
            let loadingSpinner = null;
            if (loadingSpinnerContainer) {
                loadingSpinner = new XWUISpinner(
                    loadingSpinnerContainer,
                    { spinning, label: 'Loading...' },
                    { 
                        size: 'large', 
                        color: 'white',
                        overlay,
                        blur: true
                    }
                );
                // Initially hide it
                loadingSpinner.hide();
            }
            
            // Icon SVGs (single line format for proper detection)
            const playIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
            
            const pauseIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>';
            
            const volumeIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
            
            const volumeMuteIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" stroke-width="2" fill="none"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
            
            const brightnessIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="currentColor"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
            
            const fullscreenIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
            
            const settingsIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
            
            // State
            let isPlaying = false;
            let currentVolume = 1.0;
            let currentBrightness = 1.0;
            let isMuted = false;
            
            // Format time
            function formatTime(seconds) {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            }
            
            // Update time display
            function updateTimeDisplay() {
                const current = videoElement.currentTime || 0;
                const duration = videoElement.duration || 0;
                timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
            }
            
            
            // Timeline slider
            const timelineSlider = new XWUISlider(
                document.getElementById('timeline-slider'),
                { value: 0, label: 'Timeline' },
                {
                    min: 0,
                    max: 100,
                    valueLabelDisplay: 'off',
                    color: 'primary'
                }
            );
            
            timelineSlider.onChange((value) => {
                if (videoElement.duration) {
                    const seekTime = (value / 100) * videoElement.duration;
                    videoElement.currentTime = seekTime;
                }
            });
            
            // Play/Pause button
            let playPauseButton = new XWUIButton(
                document.getElementById('play-pause-btn'),
                '',
                {
                    icon,
                    iconPosition: 'left',
                    variant: 'ghost',
                    size: 'medium',
                    className: 'icon-button'
                }
            );
            
            playPauseButton.onClick(() => {
                if (isPlaying) {
                    videoElement.pause();
                } else {
                    videoElement.play();
                }
            });
            
            // Volume button
            let volumeButton = new XWUIButton(
                document.getElementById('volume-btn'),
                '',
                {
                    icon,
                    iconPosition: 'left',
                    variant: 'ghost',
                    size: 'medium',
                    className: 'icon-button'
                }
            );
            
            volumeButton.onClick(() => {
                isMuted = !isMuted;
                videoElement.muted = isMuted;
                // Update icon directly in DOM
                const iconElement = document.getElementById('volume-btn').querySelector('.xwui-button-icon, .xwui-item-icon');
                if (iconElement) {
                    iconElement.innerHTML = isMuted ? volumeMuteIcon : volumeIcon;
                }
            });
            
            // Volume slider
            const volumeSlider = new XWUISlider(
                document.getElementById('volume-slider'),
                { value: 100, label: 'Volume' },
                {
                    min: 0,
                    max: 100,
                    orientation: 'vertical',
                    valueLabelDisplay: 'auto',
                    color: 'primary',
                    showTitle,
                    direction: 'ttd'
                }
            );
            
            volumeSlider.onChange((value) => {
                currentVolume = value / 100;
                videoElement.volume = currentVolume;
                const iconElement = document.getElementById('volume-btn').querySelector('.xwui-button-icon, .xwui-item-icon');
                if (value === 0) {
                    isMuted = true;
                    videoElement.muted = true;
                    if (iconElement) iconElement.innerHTML = volumeMuteIcon;
                } else if (isMuted && value > 0) {
                    isMuted = false;
                    videoElement.muted = false;
                    if (iconElement) iconElement.innerHTML = volumeIcon;
                }
            });
            
            // Brightness button
            let brightnessButton = new XWUIButton(
                document.getElementById('brightness-btn'),
                '',
                {
                    icon,
                    iconPosition: 'left',
                    variant: 'ghost',
                    size: 'medium',
                    className: 'icon-button'
                }
            );
            
            // Brightness slider
            const brightnessSlider = new XWUISlider(
                document.getElementById('brightness-slider'),
                { value: 100, label: 'Brightness' },
                {
                    min: 0,
                    max: 100,
                    orientation: 'vertical',
                    valueLabelDisplay: 'auto',
                    color: 'warning',
                    showTitle,
                    direction: 'ttd'
                }
            );
            
            brightnessSlider.onChange((value) => {
                currentBrightness = value / 100;
                videoElement.style.filter = `brightness(${currentBrightness})`;
            });
            
            // Fullscreen button
            let fullscreenButton = new XWUIButton(
                document.getElementById('fullscreen-btn'),
                '',
                {
                    icon,
                    iconPosition: 'left',
                    variant: 'ghost',
                    size: 'medium',
                    className: 'icon-button'
                }
            );
            
            fullscreenButton.onClick(() => {
                if (!document.fullscreenElement) {
                    videoWrapper.requestFullscreen().catch(err => {
                        console.log('Error attempting to enable fullscreen:', err);
                    });
                } else {
                    document.exitFullscreen();
                }
            });
            
            // Settings button
            let settingsButton = new XWUIButton(
                document.getElementById('settings-btn'),
                '',
                {
                    icon,
                    iconPosition: 'left',
                    variant: 'ghost',
                    size: 'medium',
                    className: 'icon-button'
                }
            );
            
            settingsButton.onClick(() => {
                alert('Settings menu would open here');
            });
            
            // Video event listeners
            videoElement.addEventListener('loadstart', () => {
                // Show spinner when video starts loading
                if (loadingSpinner && loadingSpinnerContainer) {
                    loadingSpinner.show('Loading...');
                    loadingSpinnerContainer.style.display = 'flex';
                    loadingSpinnerContainer.style.visibility = 'visible';
                }
            });
            
            videoElement.addEventListener('loadedmetadata', () => {
                updateTimeDisplay();
            });
            
            videoElement.addEventListener('timeupdate', () => {
                if (videoElement.duration) {
                    const progress = (videoElement.currentTime / videoElement.duration) * 100;
                    timelineSlider.setValue(progress, false);
                    updateTimeDisplay();
                }
            });
            
            // Buffering events
            videoElement.addEventListener('waiting', () => {
                // Video is waiting for data - show spinner prominently
                if (loadingSpinner && loadingSpinnerContainer) {
                    loadingSpinner.show('Buffering...');
                    loadingSpinnerContainer.style.display = 'flex';
                    loadingSpinnerContainer.style.visibility = 'visible';
                }
            });
            
            
            videoElement.addEventListener('canplay', () => {
                // Hide spinner when video can play
                if (loadingSpinner && loadingSpinnerContainer) {
                    loadingSpinner.hide();
                    loadingSpinnerContainer.style.display = 'none';
                    loadingSpinnerContainer.style.visibility = 'hidden';
                }
            });
            
            videoElement.addEventListener('canplaythrough', () => {
                // Hide spinner when video can play through
                if (loadingSpinner && loadingSpinnerContainer) {
                    loadingSpinner.hide();
                    loadingSpinnerContainer.style.display = 'none';
                    loadingSpinnerContainer.style.visibility = 'hidden';
                }
            });
            
            videoElement.addEventListener('playing', () => {
                // Hide spinner when video starts playing
                if (loadingSpinner && loadingSpinnerContainer) {
                    loadingSpinner.hide();
                    loadingSpinnerContainer.style.display = 'none';
                    loadingSpinnerContainer.style.visibility = 'hidden';
                }
            });
            
            // Initial buffering bar update
            
            videoElement.addEventListener('play', () => {
                isPlaying = true;
                const iconElement = document.getElementById('play-pause-btn').querySelector('.xwui-button-icon, .xwui-item-icon');
                if (iconElement) iconElement.innerHTML = pauseIcon;
            });
            
            videoElement.addEventListener('pause', () => {
                isPlaying = false;
                const iconElement = document.getElementById('play-pause-btn').querySelector('.xwui-button-icon, .xwui-item-icon');
                if (iconElement) iconElement.innerHTML = playIcon;
            });
            
            videoElement.addEventListener('ended', () => {
                isPlaying = false;
                const iconElement = document.getElementById('play-pause-btn').querySelector('.xwui-button-icon, .xwui-item-icon');
                if (iconElement) iconElement.innerHTML = playIcon;
            });
            
            // Show controls on hover
            videoWrapper.addEventListener('mouseenter', () => {
                controlsOverlay.classList.add('show');
            });
            
            videoWrapper.addEventListener('mouseleave', () => {
                controlsOverlay.classList.remove('show');
            });
            
            // Keep controls visible when interacting with them
            controlsOverlay.addEventListener('mouseenter', () => {
                controlsOverlay.classList.add('show');
            });
            
            // Initialize volume
            videoElement.volume = currentVolume;
            volumeSlider.setValue(currentVolume * 100, false);
            
            
            tester.setStatus('✅ Player controls initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('Player controls test error:', error);
        }
