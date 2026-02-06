/**
 * Assistant Component
 * AI Assistant Chat component for the Governance Studio
 */

export class Assistant {
    private container: HTMLElement;
    private themeStylesheet: HTMLLinkElement | null = null;

    constructor(container: HTMLElement) {
        this.container = container;
        this.init();
    }

    private init(): void {
        this.setupTheme();
        this.setupMessageListener();
    }

    private setupTheme(): void {
        // Find or create theme stylesheet
        this.themeStylesheet = document.getElementById('themeStylesheet') as HTMLLinkElement;
        
        if (!this.themeStylesheet) {
            this.themeStylesheet = document.createElement('link');
            this.themeStylesheet.id = 'themeStylesheet';
            this.themeStylesheet.rel = 'stylesheet';
            document.head.appendChild(this.themeStylesheet);
        }

        // Initialize theme
        this.initTheme();
    }

    private initTheme(): void {
        let theme = 'light';
        
        // Try to get theme from parent first
        if (window.parent && window.parent !== window) {
            try {
                const parentTheme = window.parent.document.documentElement.getAttribute('data-theme');
                if (parentTheme) {
                    theme = parentTheme;
                    document.documentElement.setAttribute('data-theme', theme);
                    localStorage.setItem('theme', theme);
                    this.loadThemeCSS(theme);
                    return;
                }
            } catch (e) {
                // Cross-origin or not ready, fall back to localStorage
            }
        }
        
        // Fallback to localStorage
        theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        this.loadThemeCSS(theme);
    }

    private loadThemeCSS(theme: string): void {
        if (this.themeStylesheet) {
            // Adjust path based on where the component is served from
            const basePath = this.getBasePath();
            this.themeStylesheet.href = `${basePath}styles/theme_${theme}.css`;
        }
    }

    private getBasePath(): string {
        // Determine base path based on current location
        const path = window.location.pathname;
        if (path.includes('/app/comps/')) {
            return '../';
        } else if (path.includes('/app/')) {
            return './';
        }
        return '../styles/';
    }

    private setupMessageListener(): void {
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'themeChange') {
                const theme = event.data.theme;
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                this.loadThemeCSS(theme);
            }
        });
    }

    public destroy(): void {
        // Cleanup if needed
    }
}

