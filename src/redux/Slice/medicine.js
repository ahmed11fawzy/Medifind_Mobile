import { coreApi } from "./coreApi";

export const medicine = coreApi.injectEndpoints({
    endpoints: (build) => ({
        getAllMedicines: build.query({    //why i need it? -->for doctor view in offersReview 
            query: () => ({
                url: 'medicine', 
                method: 'GET',
            }),
            providesTags: ['Medicine']
        }),

        getUserOffers:build.query({    //for donation screen
            query:(id)=>({
                url:`medicine/${id}`,
                method: 'Get',

            }),
            providesTags:['Medicine']

        }),
        getAcceptedMedicines: build.query({
            query: () => ({
                url: "acceptedMedicine",
                method: "GET"
            }),
            providesTags: ['Medicine']
        }),
        addMedicine: build.mutation({
            query: (body) => ({
                url: `medicine`,
                method: "POST",
                body,
                responseHandler: 'text',  // Add this to get raw response
            }),
            transformResponse: (response, meta) => ({
                data: JSON.parse(response),
                headers: meta.response.headers
            }),
            invalidatesTags: ['Medicine']
        }),

        updateMedicine: build.mutation({
            query: ({ id, body }) => ({
                url: `medicine/${id}`,
                method: 'PATCH',
                body,
                responseHandler: 'text',

            }),

        transformResponse: (response, meta) => ({
            data: JSON.parse(response),
            headers: meta.response.headers

    }),
    invalidatesTags: ['Medicine']
  
    }),
        deleteMedicine: build.mutation({
        query: (id) => ({
            url: `medicine/${id}`,
            method: "DELETE",
            responseHandler: "text",
        }),
        invalidatesTags: ["Medicine"], // Invalidate cache to refetch updated data
       }),
 
}) })

export const { useGetAllMedicinesQuery
                ,useGetUserOffersQuery
                , useGetAcceptedMedicinesQuery
                , useAddMedicineMutation 
                ,useUpdateMedicineMutation   
                , useDeleteMedicineMutation
                
                    } = medicine