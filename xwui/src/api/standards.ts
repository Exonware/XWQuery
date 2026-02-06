/**
 * Standards API
 * API client for standards-related endpoints
 */

import { ApiClient } from './client';
import type { StandardInfo, StandardsListResponse, CategoriesResponse, OrganizationsResponse } from './types';

export class StandardsApi extends ApiClient {
    /**
     * List all available standards
     */
    async listStandards(): Promise<StandardsListResponse> {
        return await this.get<StandardsListResponse>('/api/standards');
    }

    /**
     * Get a specific standard by ID
     */
    async getStandard(standardId: string): Promise<any> {
        // Security: prevent directory traversal
        if (standardId.includes('..') || standardId.includes('/') || standardId.includes('\\')) {
            throw new Error('Invalid standard ID');
        }

        return await this.get<any>(`/api/standards/${standardId}`);
    }

    /**
     * Get all unique categories
     */
    async getCategories(): Promise<CategoriesResponse> {
        return await this.get<CategoriesResponse>('/api/categories');
    }

    /**
     * Get all unique organizations
     */
    async getOrganizations(): Promise<OrganizationsResponse> {
        return await this.get<OrganizationsResponse>('/api/organizations');
    }
}

// Export singleton instance
export const standardsApi = new StandardsApi();

