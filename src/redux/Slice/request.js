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
            invalidatesTags: ['Request']
        }),
        updateRequest: build.mutation({
            query: ({ id, body }) => ({
                url: `request/${id}`,
                method: 'PATCH',
                body,
                responseHandler: 'text',

            }),

        transformResponse: (response, meta) => ({
            data: JSON.parse(response),
            headers: meta.response.headers

    }),
    invalidatesTags: ['Request']
  
    }),
      deleteRequest: build.mutation({
        query: (id) => ({
            url: `request/${id}`,
            method: "DELETE",
            responseHandler: "text",
        }),
        invalidatesTags: ["Request"], // Invalidate cache to refetch updated data
    }),


        getUserRequests: build.query({
            query: (id) => ({
                url: `request/${id}`,
                method: 'GET'
            }),
            providesTags: ['Request']
        }),
        getAllRequests:build.query({   //for doctor view in requestsReview
            query:()=>({
                url:  `request`,
                method: `GET`
            }),
                providesTags:['Request']
            }),

       
       
})
})
export const { useAddRequestMutation
              ,useUpdateRequestMutation
              ,useDeleteRequestMutation
              ,useGetUserRequestsQuery
              , useGetAllRequestsQuery
              
             
              } = request;