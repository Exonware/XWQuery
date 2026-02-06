/**
 * XWUIVideoPlayer Component
 * Video player with controls using native HTML5 video
 * Reuses: XWUIButton, XWUISlider, XWUIProgress, XWUIAspectRatio
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIAspectRatio } from '../XWUIAspectRatio/XWUIAspectRatio';

export interface XWUIVideoSource {
    src: string;
    type?: string;
}

// Component-level configuration
export interface XWUIVideoPlayerConfig {
    autoplay?: boolean;
    controls?: boolean;
    loop?: boolean;
    muted?: boolean;
    playsInline?: boolean;
    preload?: 'none' | 'metadata' | 'auto';
    aspectRatio?: '16:9' | '4:3' | '21:9' | 'auto';
    showCustomControls?: boolean;
    className?: string;
}

// Data type
export interface XWUIVideoPlayerData {
    sources: XWUIVideoSource[];
    poster?: string;
    title?: string;
}

export class XWUIVideoPlayer extends XWUIComponent<XWUIVideoPlayerData, XWUIVideoPlayerConfig> {
    private playerElement: HTMLElement | null = null;
    private videoElement: HTMLVideoElement | null = null;
    private controlsContainer: HTMLElement | null = null;
    private playPauseBtn: any = null;
    private progressSlider: any = null;
    private volumeSlider: any = null;
    private timeDisplay: HTMLElement | null = null;
    private aspectRatioComponent: XWUIAspectRatio | null = null;
    private isPlaying: boolean = false;
    private isDragging: boolean = false;

    constructor(
        container: HTMLElement,
        data: XWUIVideoPlayerData,
        conf_comp: XWUIVideoPlayerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.data.sources = this.data.sources || [];
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIVideoPlayerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIVideoPlayerConfig {
        return {
            autoplay: conf_comp?.autoplay ?? false,
            controls: conf_comp?.controls ?? true,
            loop: conf_comp?.loop ?? false,
            muted: conf_comp?.muted ?? false,
            playsInline: conf_comp?.playsInline ?? true,
            preload: conf_comp?.preload ?? 'metadata',
            aspectRatio: conf_comp?.aspectRatio ?? '16:9',
            showCustomControls: conf_comp?.showCustomControls ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.playerElement = document.createElement('div');
        this.playerElement.className = 'xwui-video-player';
        
        if (this.config.className) {
            this.playerElement.classList.add(this.config.className);
        }

        // Create video element
        this.videoElement = document.createElement('video');
        this.videoElement.className = 'xwui-video-player-video';
        this.videoElement.autoplay = this.config.autoplay || false;
        this.videoElement.loop = this.config.loop || false;
        this.videoElement.muted = this.config.muted || false;
        this.videoElement.playsInline = this.config.playsInline !== false;
        this.videoElement.preload = this.config.preload || 'metadata';
        
        if (this.data.poster) {
            this.videoElement.poster = this.data.poster;
        }

        // Add sources
        this.data.sources.forEach(source => {
            const sourceElement = document.createElement('source');
            sourceElement.src = source.src;
            if (source.type) {
                sourceElement.type = source.type;
            }
            this.videoElement!.appendChild(sourceElement);
        });

        // Use native controls or custom
        if (this.config.controls && !this.config.showCustomControls) {
            this.videoElement.controls = true;
        }

        // Wrap in aspect ratio if specified
        if (this.config.aspectRatio !== 'auto' && this.config.showCustomControls) {
            const aspectContainer = document.createElement('div');
            this.aspectRatioComponent = new XWUIAspectRatio(aspectContainer, {
                content: this.videoElement
            }, {
                ratio: this.config.aspectRatio as any,
                objectFit: 'contain'
            }, this.conf_sys, this.conf_usr);
            this.registerChildComponent(this.aspectRatioComponent);
            this.playerElement.appendChild(aspectContainer);
        } else {
            this.playerElement.appendChild(this.videoElement);
        }

        // Add custom controls if enabled
        if (this.config.showCustomControls) {
            this.renderCustomControls();
        }

        // Setup event listeners
        this.setupEventListeners();

        this.container.appendChild(this.playerElement);
    }

    private renderCustomControls(): void {
        if (!this.videoElement) return;

        this.controlsContainer = document.createElement('div');
        this.controlsContainer.className = 'xwui-video-player-controls';

        // Import and create controls
        import('../XWUIButton/index').then(({ XWUIButton }) => {
            import('../XWUISlider/index').then(({ XWUISlider }) => {
                // Play/Pause button
                const playPauseContainer = document.createElement('div');
                this.playPauseBtn = new XWUIButton(playPauseContainer, '', {
                    variant: 'ghost',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
                });
                this.registerChildComponent(this.playPauseBtn);
                this.playPauseBtn.onClick(() => this.togglePlayPause());

                // Progress slider
                const progressContainer = document.createElement('div');
                progressContainer.className = 'xwui-video-player-progress';
                this.progressSlider = new XWUISlider(progressContainer, {
                    value: 0,
                    label: ''
                }, {
                    min: 0,
                    max: 100,
                    step: 0.1,
                    showValue: false
                });
                this.registerChildComponent(this.progressSlider);
                this.progressSlider.onChange((value: number) => {
                    if (!this.isDragging && this.videoElement) {
                        const seekTime = (value / 100) * this.videoElement.duration;
                        this.videoElement.currentTime = seekTime;
                    }
                });

                // Time display
                this.timeDisplay = document.createElement('div');
                this.timeDisplay.className = 'xwui-video-player-time';
                this.timeDisplay.textContent = '0:00 / 0:00';

                // Volume slider
                const volumeContainer = document.createElement('div');
                volumeContainer.className = 'xwui-video-player-volume';
                this.volumeSlider = new XWUISlider(volumeContainer, {
                    value: 100,
                    label: ''
                }, {
                    min: 0,
                    max: 100,
                    step: 1,
                    showValue: false
                });
                this.registerChildComponent(this.volumeSlider);
                this.volumeSlider.onChange((value: number) => {
                    if (this.videoElement) {
                        this.videoElement.volume = value / 100;
                    }
                });

                // Mute button
                const muteContainer = document.createElement('div');
                const muteBtn = new XWUIButton(muteContainer, '', {
                    variant: 'ghost',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>'
                });
                muteBtn.onClick(() => {
                    if (this.videoElement) {
                        this.videoElement.muted = !this.videoElement.muted;
                        this.volumeSlider?.setValue(this.videoElement.muted ? 0 : this.videoElement.volume * 100);
                    }
                });

                // Fullscreen button
                const fullscreenContainer = document.createElement('div');
                const fullscreenBtn = new XWUIButton(fullscreenContainer, '', {
                    variant: 'ghost',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>'
                });
                fullscreenBtn.onClick(() => this.toggleFullscreen());

                // Assemble controls
                const controlsRow = document.createElement('div');
                controlsRow.className = 'xwui-video-player-controls-row';
                controlsRow.appendChild(playPauseContainer);
                controlsRow.appendChild(progressContainer);
                controlsRow.appendChild(this.timeDisplay);
                controlsRow.appendChild(volumeContainer);
                controlsRow.appendChild(muteContainer);
                controlsRow.appendChild(fullscreenContainer);

                this.controlsContainer.appendChild(controlsRow);
                this.playerElement!.appendChild(this.controlsContainer);
            });
        });
    }

    private setupEventListeners(): void {
        if (!this.videoElement) return;

        this.videoElement.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayPauseButton();
        });

        this.videoElement.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayPauseButton();
        });

        this.videoElement.addEventListener('timeupdate', () => {
            if (!this.isDragging && this.videoElement && this.progressSlider) {
                const progress = (this.videoElement.currentTime / this.videoElement.duration) * 100;
                this.progressSlider.setValue(progress);
                this.updateTimeDisplay();
            }
        });

        this.videoElement.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay();
        });

        // Progress slider drag
        if (this.progressSlider) {
            // Note: XWUISlider might need drag start/end events
            // For now, handle through change event with flag
        }
    }

    private togglePlayPause(): void {
        if (!this.videoElement) return;
        if (this.isPlaying) {
            this.videoElement.pause();
        } else {
            this.videoElement.play();
        }
    }

    private updatePlayPauseButton(): void {
        if (!this.playPauseBtn) return;
        const icon = this.isPlaying
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
        // Note: XWUIButton might need updateIcon method
    }

    private updateTimeDisplay(): void {
        if (!this.timeDisplay || !this.videoElement) return;
        const current = this.formatTime(this.videoElement.currentTime);
        const duration = this.formatTime(this.videoElement.duration || 0);
        this.timeDisplay.textContent = `${current} / ${duration}`;
    }

    private formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    private toggleFullscreen(): void {
        if (!this.videoElement) return;
        if (!document.fullscreenElement) {
            this.videoElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    public play(): void {
        this.videoElement?.play();
    }

    public pause(): void {
        this.videoElement?.pause();
    }

    public getElement(): HTMLElement | null {
        return this.playerElement;
    }

    public destroy(): void {
        // All registered child components (aspectRatioComponent, playPauseBtn, progressSlider, volumeSlider) 
        // are automatically destroyed by base class
        // Clean up event listeners
        if (this.videoElement) {
            this.videoElement.pause();
            this.videoElement.src = '';
            this.videoElement.load();
        }
        // Clear references
        this.videoElement = null;
        this.playerElement = null;
        this.controlsContainer = null;
        this.timeDisplay = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIVideoPlayer as any).componentName = 'XWUIVideoPlayer';


