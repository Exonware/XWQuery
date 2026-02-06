/**
 * API Client
 * Centralized API client with error handling and response validation
 */

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public response?: Response
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = window.location.origin) {
        this.baseUrl = baseUrl;
    }

    /**
     * Make a fetch request with proper error handling
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            // Check if response is OK
            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorMessage;
                } catch {
                    // If response is not JSON, try to get text
                    try {
                        const errorText = await response.text();
                        errorMessage = errorText || errorMessage;
                    } catch {
                        // Use status text as fallback
                        errorMessage = response.statusText || errorMessage;
                    }
                }
                throw new ApiError(errorMessage, response.status, response);
            }

            // Verify content type is JSON
            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Expected JSON but got:', contentType, text.substring(0, 200));
                throw new ApiError(
                    `Expected JSON but got ${contentType}. Response: ${text.substring(0, 100)}...`,
                    response.status,
                    response
                );
            }

            // Parse and return JSON
            const data = await response.json();
            return data as T;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            // Handle network errors or other fetch errors
            throw new ApiError(
                `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                0
            );
        }
    }

    /**
     * GET request
     */
    protected async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    /**
     * POST request
     */
    protected async post<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * PUT request
     */
    protected async put<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * DELETE request
     */
    protected async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

