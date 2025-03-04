import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL, FEATURE_ENABLED } from '@env';
const baseUrl = BASE_URL;
export const coreApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl
    }),
    tagTypes: ['Medicine', 'User', 'Request', 'Orders'],
    endpoints: () => ({})
})

