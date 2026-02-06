/**
 * XWUIVideoRecorder Component
 * Video recorder using MediaRecorder API
 * Reuses: XWUIButton, XWUIProgress, XWUIVideoPlayer
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIVideoRecorderConfig {
    maxDuration?: number; // seconds
    showPreview?: boolean;
    className?: string;
}

// Data type
export interface XWUIVideoRecorderData {
    recordedBlob?: Blob;
    recordedUrl?: string;
}

export class XWUIVideoRecorder extends XWUIComponent<XWUIVideoRecorderData, XWUIVideoRecorderConfig> {
    private recorderElement: HTMLElement | null = null;
    private videoElement: HTMLVideoElement | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private stream: MediaStream | null = null;
    private recordedChunks: Blob[] = [];
    private isRecording: boolean = false;
    private recordingTime: number = 0;
    private recordingTimer: ReturnType<typeof setInterval> | null = null;
    private recordBtn: any = null;
    private progress: any = null;
    private stopBtn: any = null;

    constructor(
        container: HTMLElement,
        data: XWUIVideoRecorderData = {},
        conf_comp: XWUIVideoRecorderConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIVideoRecorderConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIVideoRecorderConfig {
        return {
            maxDuration: conf_comp?.maxDuration,
            showPreview: conf_comp?.showPreview ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.recorderElement = document.createElement('div');
        this.recorderElement.className = 'xwui-video-recorder';
        
        if (this.config.className) {
            this.recorderElement.classList.add(this.config.className);
        }

        // Video preview
        if (this.config.showPreview) {
            this.videoElement = document.createElement('video');
            this.videoElement.className = 'xwui-video-recorder-preview';
            this.videoElement.autoplay = true;
            this.videoElement.muted = true;
            this.videoElement.playsInline = true;
            this.recorderElement.appendChild(this.videoElement);
        }

        // Controls
        this.renderControls();

        this.container.appendChild(this.recorderElement);
    }

    private renderControls(): void {
        import('../XWUIButton/index').then(({ XWUIButton }) => {
            import('../XWUIProgress/index').then(({ XWUIProgress }) => {
                const controlsContainer = document.createElement('div');
                controlsContainer.className = 'xwui-video-recorder-controls';

                // Record button
                const recordBtnContainer = document.createElement('div');
                this.recordBtn = new XWUIButton(recordBtnContainer, 'Start Recording', {
                    variant: 'danger'
                });
                this.registerChildComponent(this.recordBtn);
                this.recordBtn.onClick(() => this.toggleRecording());

                // Timer/Progress
                const progressContainer = document.createElement('div');
                progressContainer.className = 'xwui-video-recorder-progress';
                this.progress = new XWUIProgress(progressContainer, {
                    value: 0,
                    label: '0:00'
                }, {
                    variant: 'linear'
                });
                this.registerChildComponent(this.progress);

                // Stop/Save button
                const stopBtnContainer = document.createElement('div');
                this.stopBtn = new XWUIButton(stopBtnContainer, 'Stop & Save', {
                    variant: 'primary'
                });
                this.registerChildComponent(this.stopBtn);
                this.stopBtn.onClick(() => this.stopRecording());

                controlsContainer.appendChild(recordBtnContainer);
                controlsContainer.appendChild(progressContainer);
                controlsContainer.appendChild(stopBtnContainer);
                this.recorderElement!.appendChild(controlsContainer);
            });
        });
    }

    private async toggleRecording(): Promise<void> {
        if (this.isRecording) {
            this.pauseRecording();
        } else {
            await this.startRecording();
        }
    }

    private async startRecording(): Promise<void> {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            
            if (this.videoElement) {
                this.videoElement.srcObject = this.stream;
            }

            this.mediaRecorder = new MediaRecorder(this.stream);
            this.recordedChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
                this.data.recordedBlob = blob;
                this.data.recordedUrl = URL.createObjectURL(blob);
                
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                }
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            this.recordingTime = 0;

            // Start timer
            this.recordingTimer = setInterval(() => {
                this.recordingTime++;
                if (this.config.maxDuration && this.recordingTime >= this.config.maxDuration) {
                    this.stopRecording();
                }
            }, 1000);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    }

    private pauseRecording(): void {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.pause();
            this.isRecording = false;
            if (this.recordingTimer) {
                clearInterval(this.recordingTimer);
            }
        }
    }

    private stopRecording(): void {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            if (this.recordingTimer) {
                clearInterval(this.recordingTimer);
            }
        }
    }

    public destroy(): void {
        // All registered child components (recordBtn, progress, stopBtn) are automatically destroyed by base class
        // Stop recording if active
        if (this.isRecording) {
            this.stopRecording();
        }
        // Clean up timer
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
        // Stop media stream
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        // Clean up video element
        if (this.videoElement) {
            this.videoElement.srcObject = null;
            this.videoElement = null;
        }
        // Clean up media recorder
        this.mediaRecorder = null;
        // Clean up recorded chunks
        this.recordedChunks = [];
        this.recorderElement = null;
        this.recordBtn = null;
        this.progress = null;
        this.stopBtn = null;
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIVideoRecorder as any).componentName = 'XWUIVideoRecorder';


