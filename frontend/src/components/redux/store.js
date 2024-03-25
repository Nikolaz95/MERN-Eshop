import {configureStore} from "@reduxjs/toolkit";
import { productApi } from "./api/productApi";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";

import  useReducer  from "./features/userSlice.js";
import  cartReducer  from "./features/CartSlice.js";
import { orderApi } from "./api/orderApi.js";


export const store = configureStore ({
    reducer: {
        auth: useReducer,
        cart: cartReducer,
       [productApi.reducerPath]: productApi.reducer, 
       [authApi.reducerPath]: authApi.reducer, 
       [userApi.reducerPath]: userApi.reducer,
       [orderApi.reducerPath]: orderApi.reducer,

    },
    middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat([productApi.middleware, 
        authApi.middleware, 
        userApi.middleware,
        orderApi.middleware,
    ]),
});