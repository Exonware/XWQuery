/**
 * useMediaQuery Hook
 * Reacts to media query changes and returns whether the query matches
 */

/**
 * Check if a media query matches
 * @param query - CSS media query string (e.g., "(min-width: 768px)")
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return false;
    }

    try {
        return window.matchMedia(query).matches;
    } catch (error) {
        console.warn('Invalid media query:', query, error);
        return false;
    }
}

/**
 * Watch a media query and call a callback when it changes
 * @param query - CSS media query string
 * @param callback - Function to call when match state changes
 * @param options - Options for matchMedia
 * @returns Cleanup function to remove the listener
 */
export function watchMediaQuery(
    query: string,
    callback: (matches: boolean) => void,
    options?: { immediate?: boolean }
): () => void {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return () => {};
    }

    try {
        const mediaQuery = window.matchMedia(query);
        
        const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
            callback(event.matches);
        };

        // Call immediately if requested
        if (options?.immediate !== false) {
            callback(mediaQuery.matches);
        }

        // Modern browsers support addEventListener
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => {
                mediaQuery.removeEventListener('change', handleChange);
            };
        } 
        // Fallback for older browsers
        else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleChange);
            return () => {
                mediaQuery.removeListener(handleChange);
            };
        }

        return () => {};
    } catch (error) {
        console.warn('Invalid media query:', query, error);
        return () => {};
    }
}

/**
 * Media query manager class for reactive media query watching
 */
export class MediaQueryManager {
    private query: string;
    private callback: (matches: boolean) => void;
    private cleanup: (() => void) | null = null;
    private mediaQuery: MediaQueryList | null = null;
    private currentMatches: boolean = false;

    constructor(
        query: string,
        callback: (matches: boolean) => void,
        options?: { immediate?: boolean }
    ) {
        this.query = query;
        this.callback = callback;
        this.attach(options);
    }

    attach(options?: { immediate?: boolean }): void {
        this.detach();

        if (typeof window === 'undefined' || !window.matchMedia) {
            return;
        }

        try {
            this.mediaQuery = window.matchMedia(this.query);
            this.currentMatches = this.mediaQuery.matches;

            const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
                this.currentMatches = event.matches;
                this.callback(event.matches);
            };

            if (options?.immediate !== false) {
                this.callback(this.currentMatches);
            }

            if (this.mediaQuery.addEventListener) {
                this.mediaQuery.addEventListener('change', handleChange);
                this.cleanup = () => {
                    if (this.mediaQuery) {
                        this.mediaQuery.removeEventListener('change', handleChange);
                    }
                };
            } else if (this.mediaQuery.addListener) {
                this.mediaQuery.addListener(handleChange);
                this.cleanup = () => {
                    if (this.mediaQuery) {
                        this.mediaQuery.removeListener(handleChange);
                    }
                };
            }
        } catch (error) {
            console.warn('Invalid media query:', this.query, error);
        }
    }

    detach(): void {
        if (this.cleanup) {
            this.cleanup();
            this.cleanup = null;
        }
        this.mediaQuery = null;
    }

    getMatches(): boolean {
        return this.currentMatches;
    }

    updateQuery(query: string, options?: { immediate?: boolean }): void {
        this.query = query;
        this.attach(options);
    }

    destroy(): void {
        this.detach();
        this.callback = () => {};
    }
}

