import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL, FEATURE_ENABLED } from '@env';

<<<<<<< HEAD
const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: async (headers) => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
      return headers;
    },
  });


export const coreApi = createApi({
    reducerPath: 'api',
    baseQuery,
        
=======
export const coreApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL || "http://localhost:7777",
        timeout: 10000, // Add a 10-second timeout
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
            return headers;
        }
    }),
>>>>>>> 51d4565b740cd2cd6818c0c69de901b503114b88
    tagTypes: ['Medicine', 'User', 'Request', 'Orders'],
    endpoints: () => ({})
})

