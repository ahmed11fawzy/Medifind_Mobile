import { coreApi } from "./coreApi";

export const medicine = coreApi.injectEndpoints({
    endpoints: (build) => ({
        getAllMedicines: build.query({
            query: () => ({
                url: 'medicine',
                method: 'GET',
            }),
            providesTags: ['Medicine']
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
            providesTags: ['Medicine']
        }),
    })
})

export const { useGetAllMedicinesQuery, useGetAcceptedMedicinesQuery, useAddMedicineMutation } = medicine