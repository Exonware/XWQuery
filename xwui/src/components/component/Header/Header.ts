/**
 * Header Component
 * Application header with theme and language controls
 */

export class Header {
    private container: HTMLElement;
    private themeStylesheet: HTMLLinkElement | null = null;
    private themeSelect: HTMLSelectElement | null = null;
    private languageSelect: HTMLSelectElement | null = null;

    constructor(container: HTMLElement) {
        this.container = container;
        this.init();
    }

    private init(): void {
        this.setupTheme();
        this.setupLanguage();
        this.setupToggleButtons();
        this.setupMessageListener();
    }

    private setupTheme(): void {
        this.themeStylesheet = document.getElementById('themeStylesheet') as HTMLLinkElement;
        
        if (!this.themeStylesheet) {
            this.themeStylesheet = document.createElement('link');
            this.themeStylesheet.id = 'themeStylesheet';
            this.themeStylesheet.rel = 'stylesheet';
            document.head.appendChild(this.themeStylesheet);
        }

        this.themeSelect = document.getElementById('themeSelect') as HTMLSelectElement;
        if (this.themeSelect) {
            this.themeSelect.addEventListener('change', (e) => {
                const target = e.target as HTMLSelectElement;
                this.changeTheme(target.value);
            });
        }

        this.initTheme();
    }

    private initTheme(): void {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.loadThemeCSS(savedTheme);
        
        if (this.themeSelect) {
            this.themeSelect.value = savedTheme;
        }
    }

    private loadThemeCSS(theme: string): void {
        if (this.themeStylesheet) {
            const basePath = this.getBasePath();
            this.themeStylesheet.href = `${basePath}styles/theme_${theme}.css`;
        }
    }

    private getBasePath(): string {
        const path = window.location.pathname;
        if (path.includes('/app/comps/')) {
            return '../';
        } else if (path.includes('/app/')) {
            return './';
        }
        return '../styles/';
    }

    public changeTheme(theme: string): void {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.loadThemeCSS(theme);
        
        if (this.themeSelect) {
            this.themeSelect.value = theme;
        }
        
        // Notify parent window
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'themeChange', theme: theme }, '*');
        }
    }

    private setupLanguage(): void {
        this.languageSelect = document.getElementById('languageSelect') as HTMLSelectElement;
        if (this.languageSelect) {
            this.languageSelect.addEventListener('change', (e) => {
                const target = e.target as HTMLSelectElement;
                this.changeLanguage(target.value);
            });
        }

        this.initLanguage();
    }

    private initLanguage(): void {
        const savedLang = localStorage.getItem('language') || 'en';
        if (this.languageSelect) {
            this.languageSelect.value = savedLang;
        }
    }

    public changeLanguage(lang: string): void {
        localStorage.setItem('language', lang);
        
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'languageChange', language: lang }, '*');
        }
    }

    private setupToggleButtons(): void {
        const toggleAssistant = document.getElementById('toggleAssistant');
        const toggleConsole = document.getElementById('toggleConsole');

        if (toggleAssistant) {
            toggleAssistant.addEventListener('click', () => this.toggleAssistant());
        }

        if (toggleConsole) {
            toggleConsole.addEventListener('click', () => this.toggleConsole());
        }

        this.initToggleButtonStates();
    }

    private initToggleButtonStates(): void {
        const assistantVisible = localStorage.getItem('assistantVisible') !== 'false';
        const consoleVisible = localStorage.getItem('consoleVisible') !== 'false';
        
        const assistantBtn = document.getElementById('toggleAssistant');
        const consoleBtn = document.getElementById('toggleConsole');
        
        if (assistantBtn) {
            assistantBtn.classList.toggle('active', !assistantVisible);
        }
        if (consoleBtn) {
            consoleBtn.classList.toggle('active', !consoleVisible);
        }
    }

    public toggleAssistant(): void {
        const isVisible = localStorage.getItem('assistantVisible') !== 'false';
        const newState = !isVisible;
        localStorage.setItem('assistantVisible', newState.toString());
        
        const btn = document.getElementById('toggleAssistant');
        if (btn) {
            btn.classList.toggle('active', !newState);
        }
        
        // Dispatch custom event for main app to handle
        window.dispatchEvent(new CustomEvent('toggleSection', { 
            detail: { section: 'assistant', visible: newState }
        }));
        
        // Also support postMessage for backward compatibility
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ 
                type: 'toggleSection', 
                section: 'assistant', 
                visible: newState 
            }, '*');
        }
    }

    public toggleConsole(): void {
        const isVisible = localStorage.getItem('consoleVisible') !== 'false';
        const newState = !isVisible;
        localStorage.setItem('consoleVisible', newState.toString());
        
        const btn = document.getElementById('toggleConsole');
        if (btn) {
            btn.classList.toggle('active', !newState);
        }
        
        // Dispatch custom event for main app to handle
        window.dispatchEvent(new CustomEvent('toggleSection', { 
            detail: { section: 'console', visible: newState }
        }));
        
        // Also support postMessage for backward compatibility
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ 
                type: 'toggleSection', 
                section: 'console', 
                visible: newState 
            }, '*');
        }
    }

    private setupMessageListener(): void {
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'themeChange') {
                const theme = event.data.theme;
                document.documentElement.setAttribute('data-theme', theme);
                this.loadThemeCSS(theme);
                if (this.themeSelect) {
                    this.themeSelect.value = theme;
                }
            }
        });
    }

    public destroy(): void {
        // Cleanup if needed
    }
}

