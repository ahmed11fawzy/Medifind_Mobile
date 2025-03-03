import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const baseUrl = "http://localhost:7777/"
export const coreApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl
    }),
    tagTypes: ['Medicine', 'User', 'Request','Orders'],
    endpoints: () => ({})
})

