import { coreApi } from "./coreApi"

export const user = coreApi.injectEndpoints({
    endpoints: (build) => ({
        userLogin: build.mutation({
            query: (body) => ({
                url: 'login',
                method: 'POST',
                body,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',

                },
                responseHandler: 'text',
            }),
            transformResponse: (response, meta) => ({
                data: JSON.parse(response),
                // Only extract needed headers as plain values
                headers: {
                    contentType: meta.response.headers.get('content-type'),
                    authorization: meta.response.headers.get('authorization'),
                    token: meta.response.headers.get('x-auth-token')
                }
            }),
            providesTags: ['User']
        }),
        getAllUsers: build.query({
            query: () => ({
                url: 'users',
                method: "GET"

            }),
            providesTags: ['User']
        }),
        userRegister: build.mutation({
            query: (body) => ({
                url: `register`,
                method: "POST",
                body,
                responseHandler: 'text',  // Add this to get raw response
            }),
            transformResponse: (response, meta) => ({
                data: JSON.parse(response),
                // Only extract needed headers as plain values
                headers: {
                    contentType: meta.response.headers.get('content-type'),
                    authorization: meta.response.headers.get('authorization')
                }
            }),
            providesTags: ['User']
        }),
    }),
    overrideExisting: true  // Add this line to allow endpoint overrides
})

export const { useUserLoginMutation, useGetAllUsersQuery, useUserRegisterMutation } = user