import{coreApi} from './coreApi'

export  const orders = coreApi.injectEndpoints({
    endpoints: (build) => ({
        addOrder: build.mutation({
            query: (body) => ({
                url: 'orders',
                method: 'POST',
                body,
                responseHandler: 'text',
            }),
            transformResponse: (response, meta) => ({
                data: JSON.parse(response),
                headers: meta.response.headers
            }),
            invalidatesTags: ['Orders']
        }),
        getOrder: build.query({
            query: (id) => ({
                url: `orders/${id}`,
                method: 'GET'
            }),
            providesTags: ['Orders']
        }),

        updateOrder: build.mutation({
            query: ({ id, body }) => ({
                url: `orders/${id}`,
                method: 'PATCH',
                body,
                responseHandler: 'text',

            }),
        transformResponse: (response, meta) => ({
            data: JSON.parse(response),
            headers: meta.response.headers

    }),
    invalidatesTags: ['Orders']
    }),
    deleteOrder: build.mutation({
        query: (id) => ({
            url: `orders/${id}`,
            method: "DELETE",
            responseHandler: "text",
        }),
        invalidatesTags: ["Orders"], // Invalidate cache to refetch updated data
    }),

    getAllOrders:build.query({  //for doctor view in requestsReview
        query:({
        url:'orders',
        method:'GET'
        }),

    providesTags:['Orders']
}),
})
})
export const {useAddOrderMutation,
                useGetOrderQuery,
                useDeleteOrderMutation,
                useGetAllOrdersQuery,
                 useUpdateOrderMutation}=orders