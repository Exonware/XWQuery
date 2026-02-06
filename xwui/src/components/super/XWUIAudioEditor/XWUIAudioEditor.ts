/**
 * XWUIAudioEditor Component
 * Audio editor with basic editing tools
 * Reuses: XWUIAudioPlayer, XWUIButton, XWUISlider
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIAudioPlayer } from '../XWUIAudioPlayer/XWUIAudioPlayer';

// Component-level configuration
export interface XWUIAudioEditorConfig {
    allowTrim?: boolean;
    allowFade?: boolean;
    className?: string;
}

// Data type
export interface XWUIAudioEditorData {
    audioSrc?: string;
}

export class XWUIAudioEditor extends XWUIComponent<XWUIAudioEditorData, XWUIAudioEditorConfig> {
    private editorElement: HTMLElement | null = null;
    private audioPlayer: XWUIAudioPlayer | null = null;
    private uploadBtn: any = null;
    private saveBtn: any = null;

    constructor(
        container: HTMLElement,
        data: XWUIAudioEditorData,
        conf_comp: XWUIAudioEditorConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIAudioEditorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIAudioEditorConfig {
        return {
            allowTrim: conf_comp?.allowTrim ?? true,
            allowFade: conf_comp?.allowFade ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.editorElement = document.createElement('div');
        this.editorElement.className = 'xwui-audio-editor';
        
        if (this.config.className) {
            this.editorElement.classList.add(this.config.className);
        }

        // Toolbar
        this.renderToolbar();

        // Audio player
        if (this.data.audioSrc) {
            const playerContainer = document.createElement('div');
            playerContainer.className = 'xwui-audio-editor-player';
            this.audioPlayer = new XWUIAudioPlayer(playerContainer, {
                sources: [{ src: this.data.audioSrc }]
            }, {
                showCustomControls: true
            }, this.conf_sys, this.conf_usr);
            this.registerChildComponent(this.audioPlayer);
            this.editorElement.appendChild(playerContainer);
        }

        // Editing controls
        this.renderEditingControls();

        this.container.appendChild(this.editorElement);
    }

    private renderToolbar(): void {
        import('../XWUIButton/index').then(({ XWUIButton }) => {
            const toolbar = document.createElement('div');
            toolbar.className = 'xwui-audio-editor-toolbar';

            const uploadBtnContainer = document.createElement('div');
            this.uploadBtn = new XWUIButton(uploadBtnContainer, 'Upload Audio', {
                variant: 'primary'
            });
            this.registerChildComponent(this.uploadBtn);
            this.uploadBtn.onClick(() => this.handleUpload());

            const saveBtnContainer = document.createElement('div');
            this.saveBtn = new XWUIButton(saveBtnContainer, 'Export Audio', {
                variant: 'success'
            });
            this.registerChildComponent(this.saveBtn);
            this.saveBtn.onClick(() => this.exportAudio());

            toolbar.appendChild(uploadBtnContainer);
            toolbar.appendChild(saveBtnContainer);
            this.editorElement!.appendChild(toolbar);
        });
    }

    private renderEditingControls(): void {
        const controlsPanel = document.createElement('div');
        controlsPanel.className = 'xwui-audio-editor-controls';
        controlsPanel.innerHTML = '<p>Audio editing controls will be available here</p>';
        this.editorElement!.appendChild(controlsPanel);
    }

    private handleUpload(): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const url = URL.createObjectURL(file);
                this.data.audioSrc = url;
                this.render();
            }
        };
        input.click();
    }

    private exportAudio(): void {
        console.log('Export audio functionality');
    }

    public destroy(): void {
        // All registered child components (audioPlayer, uploadBtn, saveBtn) are automatically destroyed by base class
        this.editorElement = null;
        this.audioPlayer = null;
        this.uploadBtn = null;
        this.saveBtn = null;
        this.container.innerHTML = '';
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIAudioEditor as any).componentName = 'XWUIAudioEditor';


