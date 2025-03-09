import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL, FEATURE_ENABLED } from '@env';

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
        
    tagTypes: ['Medicine', 'User', 'Request', 'Orders'],
    endpoints: () => ({})
})

