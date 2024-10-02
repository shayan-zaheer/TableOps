import { configureStore } from "@reduxjs/toolkit";
import orderSlice from "./orderSlice";
import auditSlice from "./auditSlice";
import categorySlice from "./categorySlice";

const store = configureStore({
    reducer: {
        order: orderSlice.reducer,
        audit: auditSlice.reducer,
        categories: categorySlice.reducer
    }
});

export default store;