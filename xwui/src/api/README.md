# API Client Documentation

## Overview

The API client provides a centralized, type-safe way to interact with the backend API. All API calls go through this module, ensuring consistent error handling, response validation, and fallback mechanisms.

## Structure

```
src/api/
├── index.ts          # Main exports
├── types.ts          # TypeScript interfaces
├── client.ts         # Base API client class
├── governance.ts     # Governance API endpoints
└── standards.ts      # Standards API endpoints
```

## Usage

### Import the API clients

```typescript
import { governanceApi, standardsApi } from '../api';
```

### Governance API

#### Get Governance Index
```typescript
// With automatic fallback to static files
const data = await governanceApi.getGovernanceIndexWithFallback();
```

#### Get Governance File
```typescript
// Load a specific governance file
const file = await governanceApi.getGovernanceFileWithFallback('standards', 'ISO-37000');
```

### Standards API

#### List All Standards
```typescript
const response = await standardsApi.listStandards();
// Returns: { standards: StandardInfo[], count: number }
```

#### Get Specific Standard
```typescript
const standard = await standardsApi.getStandard('ISO-37000');
```

#### Get Categories
```typescript
const categories = await standardsApi.getCategories();
// Returns: { categories: string[] }
```

## Error Handling

All API methods throw `ApiError` exceptions with:
- `message`: Human-readable error message
- `status`: HTTP status code (0 for network errors)
- `response`: Original Response object (if available)

```typescript
try {
    const data = await governanceApi.getGovernanceIndex();
} catch (error) {
    if (error instanceof ApiError) {
        console.error(`API Error (${error.status}): ${error.message}`);
    }
}
```

## Fallback Mechanism

The governance API includes automatic fallback to static files when the API is unavailable:

1. Try API endpoint first
2. If API fails, try multiple static file paths
3. Throw error only if all attempts fail

This ensures the application works even when the backend server is not running.

## Data Access Points

### Before (Direct Fetch Calls)
- ❌ `Menu.ts`: Direct `fetch('/api/governance')`
- ❌ `Viewer.ts`: Direct `fetch(data.url)`
- ❌ No centralized error handling
- ❌ No type safety
- ❌ Inconsistent fallback logic

### After (API Client)
- ✅ `Menu.ts`: Uses `governanceApi.getGovernanceIndexWithFallback()`
- ✅ `Viewer.ts`: Uses `governanceApi.getGovernanceFileWithFallback()`
- ✅ Centralized error handling in `ApiClient`
- ✅ Full TypeScript type safety
- ✅ Consistent fallback mechanism

## Backend Endpoints

The API client communicates with these backend endpoints:

- `GET /api/governance` - Get governance index
- `GET /api/governance/{category}/{file_id}` - Get specific governance file
- `GET /api/standards` - List all standards
- `GET /api/standards/{standard_id}` - Get specific standard
- `GET /api/categories` - Get all categories
- `GET /api/organizations` - Get all organizations

## Benefits

1. **Centralized Logic**: All API calls in one place
2. **Type Safety**: Full TypeScript support with interfaces
3. **Error Handling**: Consistent error handling across all calls
4. **Response Validation**: Automatic JSON validation and content-type checking
5. **Fallback Support**: Automatic fallback to static files when API unavailable
6. **Maintainability**: Easy to update API calls in one place
7. **Testing**: Easier to mock and test API calls

