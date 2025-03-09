import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL, FEATURE_ENABLED } from '@env';

const baseUrl = BASE_URL;

export const coreApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
            return headers;
        },
        mode: 'cors',
        credentials: 'include'
    }),
    tagTypes: ['Medicine', 'User', 'Request', 'Orders' , 'review'],
    endpoints: () => ({})
})

