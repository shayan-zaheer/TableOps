import { configureStore } from "@reduxjs/toolkit";
import orderSlice from "./orderSlice";
import auditSlice from "./auditSlice";

const store = configureStore({
    reducer: {
        order: orderSlice.reducer,
        audit: auditSlice.reducer
    }
});

export default store;