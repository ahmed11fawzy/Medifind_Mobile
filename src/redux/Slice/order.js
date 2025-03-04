import{coreApi} from './coreApi'

export  const orders = corApi.injectEndpoints({
    endpoints: (build) => ({
        addOrder: build.mutation({
            query: (body) => ({
                url:'orders',
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
        getOrder:build.query({
            query:(id)=>({
                url:`orders/${id}`
                method:'GET'
            })
            providesTags: ['Orders']
        })
    })
})

export const {useAddOrderMutation,useGetOrderQuery}=orders