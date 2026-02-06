/**
 * XWUIAudioRecorder Component
 * Audio recorder using MediaRecorder API
 * Reuses: XWUIButton, XWUIProgress
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIAudioRecorderConfig {
    maxDuration?: number; // seconds
    showWaveform?: boolean;
    className?: string;
}

// Data type
export interface XWUIAudioRecorderData {
    recordedBlob?: Blob;
    recordedUrl?: string;
}

export class XWUIAudioRecorder extends XWUIComponent<XWUIAudioRecorderData, XWUIAudioRecorderConfig> {
    private recorderElement: HTMLElement | null = null;
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
        data: XWUIAudioRecorderData = {},
        conf_comp: XWUIAudioRecorderConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIAudioRecorderConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIAudioRecorderConfig {
        return {
            maxDuration: conf_comp?.maxDuration,
            showWaveform: conf_comp?.showWaveform ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.recorderElement = document.createElement('div');
        this.recorderElement.className = 'xwui-audio-recorder';
        
        if (this.config.className) {
            this.recorderElement.classList.add(this.config.className);
        }

        // Waveform display
        if (this.config.showWaveform) {
            const waveformContainer = document.createElement('div');
            waveformContainer.className = 'xwui-audio-recorder-waveform';
            waveformContainer.innerHTML = '<p>Waveform visualization will appear here</p>';
            this.recorderElement.appendChild(waveformContainer);
        }

        // Controls
        this.renderControls();

        this.container.appendChild(this.recorderElement);
    }

    private renderControls(): void {
        import('../XWUIButton/index').then(({ XWUIButton }) => {
            import('../XWUIProgress/index').then(({ XWUIProgress }) => {
                const controlsContainer = document.createElement('div');
                controlsContainer.className = 'xwui-audio-recorder-controls';

                // Record button
                const recordBtnContainer = document.createElement('div');
                this.recordBtn = new XWUIButton(recordBtnContainer, 'Start Recording', {
                    variant: 'danger'
                });
                this.registerChildComponent(this.recordBtn);
                this.recordBtn.onClick(() => this.toggleRecording());

                // Timer/Progress
                const progressContainer = document.createElement('div');
                progressContainer.className = 'xwui-audio-recorder-progress';
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
            // Check if MediaDevices API is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                // Fallback for older browsers or non-secure contexts
                const getUserMedia = 
                    (navigator as any).getUserMedia ||
                    (navigator as any).webkitGetUserMedia ||
                    (navigator as any).mozGetUserMedia ||
                    (navigator as any).msGetUserMedia;

                if (!getUserMedia) {
                    throw new Error('getUserMedia is not supported in this browser. Please use HTTPS or localhost.');
                }

                // Use legacy API with Promise wrapper
                // Legacy API signature: getUserMedia(constraints, successCallback, errorCallback)
                this.stream = await new Promise<MediaStream>((resolve, reject) => {
                    getUserMedia.call(navigator, { audio: true }, resolve, reject);
                });
            } else {
                this.stream = await navigator.mediaDevices.getUserMedia({ 
                    audio: true 
                });
            }
            
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.recordedChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
                this.data.recordedBlob = blob;
                this.data.recordedUrl = URL.createObjectURL(blob);
                
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                }
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            this.recordingTime = 0;

            // Update button text
            if (this.recordBtn) {
                this.recordBtn.setText('Pause Recording');
            }

            // Start timer
            this.recordingTimer = setInterval(() => {
                this.recordingTime++;
                const minutes = Math.floor(this.recordingTime / 60);
                const seconds = this.recordingTime % 60;
                const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                
                if (this.progress) {
                    const maxDuration = this.config.maxDuration || 60;
                    const progressValue = (this.recordingTime / maxDuration) * 100;
                    this.progress.data.label = timeString;
                    this.progress.setValue(progressValue);
                }
                
                if (this.config.maxDuration && this.recordingTime >= this.config.maxDuration) {
                    this.stopRecording();
                }
            }, 1000);
        } catch (error) {
            console.error('Error starting recording:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert(`Cannot start recording: ${errorMessage}\n\nPlease ensure:\n- You are using HTTPS or localhost\n- You have granted microphone permissions\n- Your browser supports audio recording`);
            this.isRecording = false;
        }
    }

    private pauseRecording(): void {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.pause();
            this.isRecording = false;
            if (this.recordingTimer) {
                clearInterval(this.recordingTimer);
            }
            if (this.recordBtn) {
                this.recordBtn.setText('Resume Recording');
            }
        }
    }

    private stopRecording(): void {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            if (this.recordingTimer) {
                clearInterval(this.recordingTimer);
                this.recordingTimer = null;
            }
            if (this.recordBtn) {
                this.recordBtn.setText('Start Recording');
            }
            if (this.progress) {
                this.progress.data.label = '0:00';
                this.progress.setValue(0);
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
(XWUIAudioRecorder as any).componentName = 'XWUIAudioRecorder';


