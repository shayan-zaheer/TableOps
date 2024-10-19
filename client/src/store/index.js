import { configureStore } from "@reduxjs/toolkit";
import orderSlice from "./orderSlice";
import auditSlice from "./auditSlice";
import categorySlice from "./categorySlice";
import dealSlice from "./dealSlice";

const store = configureStore({
    reducer: {
        order: orderSlice.reducer,
        audit: auditSlice.reducer,
        categories: categorySlice.reducer,
        deal: dealSlice.reducer
    }
});

export default store;