import { coreApi } from "./coreApi"
import { BASE_URL } from '@env';

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
            query: (body) => {
                console.log('Making registration request to:', `${BASE_URL}/register`);
                return {
                    url: `register`,
                    method: "POST",
                    body,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    responseHandler: 'text',
                };
            },
            transformResponse: (response, meta) => {
                console.log('Registration response:', response);
                return {
                    data: JSON.parse(response),
                    headers: meta.response.headers
                };
            },
            transformErrorResponse: (response) => {
                console.error('Registration error response:', response);
                return response;
            },
            providesTags: ['User']
        }),
        updateUser: build.mutation({
            query: ({ id, body, token }) => ({
                url: `user/${id}`,
                method: 'PATCH',
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
            invalidatesTags: ['User'],
        }),
    }),
    overrideExisting: true  // Add this line to allow endpoint overrides
})


export const { useUserLoginMutation, useGetAllUsersQuery, useUserRegisterMutation, useUpdateUserMutation } = user

