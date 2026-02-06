/**
 * Console Component
 * Console output component for displaying messages and logs
 */

export interface ConsoleMessage {
    message: string;
    type: 'info' | 'warn' | 'error' | 'success';
    timestamp: Date;
}

export class Console {
    private container: HTMLElement;
    private messagesContainer: HTMLElement | null = null;
    private themeStylesheet: HTMLLinkElement | null = null;
    private maxMessages: number = 100;

    constructor(container: HTMLElement) {
        this.container = container;
        this.init();
    }

    private init(): void {
        this.setupDOM();
        this.setupTheme();
        this.setupMessageListener();
    }

    private setupDOM(): void {
        // Find or create messages container
        this.messagesContainer = document.getElementById('consoleMessages');
        
        if (!this.messagesContainer) {
            this.messagesContainer = document.createElement('div');
            this.messagesContainer.id = 'consoleMessages';
            const content = this.container.querySelector('.console-content');
            if (content) {
                content.appendChild(this.messagesContainer);
            } else {
                this.container.appendChild(this.messagesContainer);
            }
        }
    }

    private setupTheme(): void {
        this.themeStylesheet = document.getElementById('themeStylesheet') as HTMLLinkElement;
        
        if (!this.themeStylesheet) {
            this.themeStylesheet = document.createElement('link');
            this.themeStylesheet.id = 'themeStylesheet';
            this.themeStylesheet.rel = 'stylesheet';
            document.head.appendChild(this.themeStylesheet);
        }

        this.initTheme();
    }

    private initTheme(): void {
        let theme = 'light';
        
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
                // Cross-origin or not ready
            }
        }
        
        theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        this.loadThemeCSS(theme);
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

    private setupMessageListener(): void {
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'themeChange') {
                const theme = event.data.theme;
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                this.loadThemeCSS(theme);
            }
            
            if (event.data && event.data.type === 'consoleMessage') {
                this.addMessage(
                    event.data.message,
                    event.data.messageType || 'info'
                );
            }
        });
    }

    public addMessage(message: string, type: ConsoleMessage['type'] = 'info'): void {
        if (!this.messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `console-message console-${type}`;
        messageDiv.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.messagesContainer.appendChild(messageDiv);
        
        // Auto-scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        // Keep only last N messages
        while (this.messagesContainer.children.length > this.maxMessages) {
            this.messagesContainer.removeChild(this.messagesContainer.firstChild!);
        }
    }

    public clear(): void {
        if (this.messagesContainer) {
            this.messagesContainer.innerHTML = '';
        }
    }

    public destroy(): void {
        // Cleanup if needed
    }
}

