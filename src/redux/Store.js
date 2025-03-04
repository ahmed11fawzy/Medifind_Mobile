import { configureStore } from '@reduxjs/toolkit'
import { coreApi } from './Slice/coreApi'

export const store = configureStore({
    reducer: {
        [coreApi.reducerPath]: coreApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(coreApi.middleware)
})