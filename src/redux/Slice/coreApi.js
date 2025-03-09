import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '@env';

// Fallback URL in case environment variables don't load properly
const baseUrl = BASE_URL || 'http://192.168.1.57:7777';
console.log('API Base URL:', baseUrl); // Debug log to verify the URL

// Test server connectivity
const testServerConnectivity = async () => {
  try {
    const response = await fetch(baseUrl);
    console.log('Server connectivity test:', response.status, response.statusText);
    return response.ok;
  } catch (error) {
    console.error('Server connectivity test failed:', error.message);
    return false;
  }
};

// Run the test immediately
testServerConnectivity();

export const coreApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
            return headers;
        },
        // Add custom error handling
        validateStatus: (response, result) => {
            if (response.status >= 200 && response.status < 300) {
                return true;
            }
            console.error('API Error:', response.status, response.statusText);
            return false;
        }
    }),
    tagTypes: ['Medicine', 'User', 'Request', 'Orders'],
    endpoints: () => ({})
})
console.log('Core API:', coreApi);
