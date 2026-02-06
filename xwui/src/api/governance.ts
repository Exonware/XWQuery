/**
 * Governance API
 * API client for governance-related endpoints
 */

import { ApiClient } from './client';
import type { GovernanceData, GovernanceItem } from './types';

export class GovernanceApi extends ApiClient {
    /**
     * Get the governance index
     * Returns all governance documents organized by category
     */
    async getGovernanceIndex(): Promise<GovernanceData> {
        try {
            return await this.get<GovernanceData>('/api/governance');
        } catch (error) {
            console.error('Failed to load governance index from API:', error);
            throw error;
        }
    }

    /**
     * Get a specific governance file by category and ID
     */
    async getGovernanceFile(category: string, fileId: string): Promise<any> {
        // Validate inputs
        if (!category || !fileId) {
            throw new Error('Category and fileId are required');
        }

        // Security: prevent directory traversal
        if (category.includes('..') || fileId.includes('..') || 
            fileId.includes('/') || fileId.includes('\\')) {
            throw new Error('Invalid category or fileId');
        }

        try {
            return await this.get<any>(`/api/governance/${category}/${fileId}`);
        } catch (error) {
            console.error(`Failed to load governance file ${category}/${fileId}:`, error);
            throw error;
        }
    }

    /**
     * Try to load governance index with fallback to static file
     * This is useful when the API might not be available
     */
    async getGovernanceIndexWithFallback(): Promise<GovernanceData> {
        try {
            // Try API first
            return await this.getGovernanceIndex();
        } catch (error) {
            console.warn('API failed, trying static file fallback...');
            
            // Try static file paths
            const staticPaths = [
                '/menu/governance_index.json',
                '/app/menu/governance_index.json',
                'menu/governance_index.json',
                '../menu/governance_index.json',
                '../../menu/governance_index.json'
            ];

            for (const staticPath of staticPaths) {
                try {
                    const response = await fetch(staticPath);
                    if (response.ok) {
                        const contentType = response.headers.get('content-type') || '';
                        if (contentType.includes('application/json')) {
                            const data = await response.json();
                            console.log(`Loaded governance index from static file: ${staticPath}`);
                            return data as GovernanceData;
                        }
                    }
                } catch (e) {
                    continue;
                }
            }

            // If all fallbacks fail, re-throw the original error
            throw error;
        }
    }

    /**
     * Try to load governance file with fallback to static path
     */
    async getGovernanceFileWithFallback(
        category: string,
        fileId: string
    ): Promise<any> {
        try {
            // Try API first
            return await this.getGovernanceFile(category, fileId);
        } catch (error) {
            console.warn(`API failed for ${category}/${fileId}, trying static file fallback...`);

            // Map category to static path
            const categoryPaths: Record<string, string> = {
                "standards": "/data/standards",
                "bylaws": "/data/bylaws",
                "strategies": "/data/strat",
                "od": "/data/org",
                "policies": "/data/policies",
                "processes": "/data/processes",
                "procedures": "/data/procedures"
            };

            const staticPath = categoryPaths[category];
            if (staticPath) {
                const fallbackUrl = `${staticPath}/${fileId}.json`;
                try {
                    const response = await fetch(fallbackUrl);
                    if (response.ok) {
                        const contentType = response.headers.get('content-type') || '';
                        if (contentType.includes('application/json')) {
                            const data = await response.json();
                            console.log(`Loaded governance file from static path: ${fallbackUrl}`);
                            return data;
                        }
                    }
                } catch (e) {
                    // Fallback also failed
                }
            }

            // If all fallbacks fail, re-throw the original error
            throw error;
        }
    }
}

// Export singleton instance
export const governanceApi = new GovernanceApi();

