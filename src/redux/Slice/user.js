import { coreApi } from "./coreApi"

export const user = coreApi.injectEndpoints({
    endpoints: (build) => ({
        userLogin: build.mutation({
            query: (body) => ({
                url: `login`,
                method: "POST",
                body,
                responseHandler: 'text',  // Add this to get raw response
            }),
            transformResponse: (response, meta) => ({
                data: JSON.parse(response),
                headers: meta.response.headers
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
                headers: meta.response.headers
            }),
            providesTags: ['User']
        }),
    })
})


export const { useUserLoginMutation, useGetAllUsersQuery, useUserRegisterMutation } = user