/**
 * XWUIAudioPlayer Component
 * Audio player with controls
 * Reuses: XWUIButton, XWUISlider, XWUIProgress
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

export interface XWUIAudioSource {
    src: string;
    type?: string;
}

// Component-level configuration
export interface XWUIAudioPlayerConfig {
    autoplay?: boolean;
    controls?: boolean;
    loop?: boolean;
    muted?: boolean;
    preload?: 'none' | 'metadata' | 'auto';
    showCustomControls?: boolean;
    className?: string;
}

// Data type
export interface XWUIAudioPlayerData {
    sources: XWUIAudioSource[];
    title?: string;
    artist?: string;
    cover?: string;
}

export class XWUIAudioPlayer extends XWUIComponent<XWUIAudioPlayerData, XWUIAudioPlayerConfig> {
    private playerElement: HTMLElement | null = null;
    private audioElement: HTMLAudioElement | null = null;
    private controlsContainer: HTMLElement | null = null;
    private isPlaying: boolean = false;
    private playPauseBtn: any = null;
    private progressSlider: any = null;
    private volumeSlider: any = null;

    constructor(
        container: HTMLElement,
        data: XWUIAudioPlayerData,
        conf_comp: XWUIAudioPlayerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.data.sources = this.data.sources || [];
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIAudioPlayerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIAudioPlayerConfig {
        return {
            autoplay: conf_comp?.autoplay ?? false,
            controls: conf_comp?.controls ?? true,
            loop: conf_comp?.loop ?? false,
            muted: conf_comp?.muted ?? false,
            preload: conf_comp?.preload ?? 'metadata',
            showCustomControls: conf_comp?.showCustomControls ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.playerElement = document.createElement('div');
        this.playerElement.className = 'xwui-audio-player';
        
        if (this.config.className) {
            this.playerElement.classList.add(this.config.className);
        }

        // Create audio element
        this.audioElement = document.createElement('audio');
        this.audioElement.className = 'xwui-audio-player-audio';
        this.audioElement.autoplay = this.config.autoplay || false;
        this.audioElement.loop = this.config.loop || false;
        this.audioElement.muted = this.config.muted || false;
        this.audioElement.preload = this.config.preload || 'metadata';
        
        if (this.config.controls && !this.config.showCustomControls) {
            this.audioElement.controls = true;
        }

        // Add sources
        this.data.sources.forEach(source => {
            const sourceElement = document.createElement('source');
            sourceElement.src = source.src;
            if (source.type) {
                sourceElement.type = source.type;
            }
            this.audioElement!.appendChild(sourceElement);
        });

        this.playerElement.appendChild(this.audioElement);

        // Add custom controls if enabled
        if (this.config.showCustomControls) {
            this.renderCustomControls();
        }

        this.setupEventListeners();
        this.container.appendChild(this.playerElement);
    }

    private renderCustomControls(): void {
        import('../XWUIButton/index').then(({ XWUIButton }) => {
            import('../XWUISlider/index').then(({ XWUISlider }) => {
                this.controlsContainer = document.createElement('div');
                this.controlsContainer.className = 'xwui-audio-player-controls';

                // Cover/Info section
                if (this.data.cover || this.data.title) {
                    const infoSection = document.createElement('div');
                    infoSection.className = 'xwui-audio-player-info';
                    if (this.data.cover) {
                        const coverImg = document.createElement('img');
                        coverImg.src = this.data.cover;
                        coverImg.className = 'xwui-audio-player-cover';
                        infoSection.appendChild(coverImg);
                    }
                    if (this.data.title || this.data.artist) {
                        const textDiv = document.createElement('div');
                        if (this.data.title) {
                            const title = document.createElement('div');
                            title.className = 'xwui-audio-player-title';
                            title.textContent = this.data.title;
                            textDiv.appendChild(title);
                        }
                        if (this.data.artist) {
                            const artist = document.createElement('div');
                            artist.className = 'xwui-audio-player-artist';
                            artist.textContent = this.data.artist;
                            textDiv.appendChild(artist);
                        }
                        infoSection.appendChild(textDiv);
                    }
                    this.controlsContainer.appendChild(infoSection);
                }

                // Controls row
                const controlsRow = document.createElement('div');
                controlsRow.className = 'xwui-audio-player-controls-row';

                // Play/Pause
                const playPauseContainer = document.createElement('div');
                this.playPauseBtn = new XWUIButton(playPauseContainer, '', {
                    variant: 'primary',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
                });
                this.registerChildComponent(this.playPauseBtn);
                this.playPauseBtn.onClick(() => this.togglePlayPause());

                // Progress slider
                const progressContainer = document.createElement('div');
                progressContainer.className = 'xwui-audio-player-progress';
                this.progressSlider = new XWUISlider(progressContainer, {
                    value: 0
                }, {
                    min: 0,
                    max: 100,
                    step: 0.1,
                    showValue: false
                });
                this.registerChildComponent(this.progressSlider);
                this.progressSlider.onChange((value: number) => {
                    if (this.audioElement) {
                        const seekTime = (value / 100) * this.audioElement.duration;
                        this.audioElement.currentTime = seekTime;
                    }
                });

                // Time display
                const timeDisplay = document.createElement('div');
                timeDisplay.className = 'xwui-audio-player-time';
                timeDisplay.textContent = '0:00 / 0:00';

                // Volume
                const volumeContainer = document.createElement('div');
                volumeContainer.className = 'xwui-audio-player-volume';
                this.volumeSlider = new XWUISlider(volumeContainer, {
                    value: 100
                }, {
                    min: 0,
                    max: 100,
                    step: 1,
                    showValue: false
                });
                this.registerChildComponent(this.volumeSlider);

                controlsRow.appendChild(playPauseContainer);
                controlsRow.appendChild(progressContainer);
                controlsRow.appendChild(timeDisplay);
                controlsRow.appendChild(volumeContainer);
                this.controlsContainer.appendChild(controlsRow);
                this.playerElement!.appendChild(this.controlsContainer);

                // Update progress on timeupdate
                this.audioElement.addEventListener('timeupdate', () => {
                    if (this.audioElement && this.progressSlider) {
                        const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
                        this.progressSlider.setValue(progress);
                        const current = this.formatTime(this.audioElement.currentTime);
                        const duration = this.formatTime(this.audioElement.duration || 0);
                        timeDisplay.textContent = `${current} / ${duration}`;
                    }
                });
            });
        });
    }

    private setupEventListeners(): void {
        if (!this.audioElement) return;
        this.audioElement.addEventListener('play', () => { this.isPlaying = true; });
        this.audioElement.addEventListener('pause', () => { this.isPlaying = false; });
    }

    private togglePlayPause(): void {
        if (!this.audioElement) return;
        if (this.isPlaying) {
            this.audioElement.pause();
        } else {
            this.audioElement.play();
        }
    }

    private formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    public play(): void {
        this.audioElement?.play();
    }

    public pause(): void {
        this.audioElement?.pause();
    }

    public destroy(): void {
        // All registered child components (playPauseBtn, progressSlider, volumeSlider) are automatically destroyed by base class
        // Clean up audio element
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.src = '';
            this.audioElement.load();
            this.audioElement.removeEventListener('play', () => {});
            this.audioElement.removeEventListener('pause', () => {});
            this.audioElement.removeEventListener('timeupdate', () => {});
            this.audioElement = null;
        }
        // Clear references
        this.playerElement = null;
        this.controlsContainer = null;
        this.playPauseBtn = null;
        this.progressSlider = null;
        this.volumeSlider = null;
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIAudioPlayer as any).componentName = 'XWUIAudioPlayer';


