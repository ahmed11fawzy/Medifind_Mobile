import { corApi } from './coreApi'
export const request = corApi.injectEndpoints({
    endpoints: (build) => ({
        addRequest: build.mutation({
            query: (body) => ({
                url: 'request',
                method: 'POST',
                body,
                responseHandler: 'text',
            }),
            transformResponse: (response, meta) => ({
                data: JSON.parse(response),
                headers: meta.response.headers
            }),
            providesTags: ['Request']
        }),
        getUserRequests: build.query({
            query: (id) => ({
                url: `request/${id}`,
                method: 'GET'
            }),
            providesTags: ['Request']
        }),
       
})

export const { useAddRequestMutation, useGetUserRequestsQuery } = request;