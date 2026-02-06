/**
 * API Types
 * TypeScript interfaces for API responses
 */

export interface GovernanceItem {
    id: string;
    code?: string;
    title?: string;
    filename: string;
    version?: string;
    status?: string;
    organization?: string;
    category?: string;
}

export interface GovernanceCategory {
    name: string;
    path?: string;
    count: number;
    items: GovernanceItem[];
}

export interface GovernanceData {
    [category: string]: GovernanceCategory;
}

export interface StandardInfo {
    id: string;
    code: string;
    title: string;
    shortTitle?: string;
    version?: string;
    status?: string;
    organization?: string;
    category?: string;
}

export interface StandardsListResponse {
    standards: StandardInfo[];
    count: number;
}

export interface CategoriesResponse {
    categories: string[];
}

export interface OrganizationsResponse {
    organizations: string[];
}

export interface ApiError {
    detail: string;
    status?: number;
}

