import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "order",
    initialState: [],
    reducers: {
        addItem: (state, action) => {
            const { name, price, quantity } = action.payload;
            const duplicateIndex = state.findIndex(item => item.name === name);

            if (duplicateIndex !== -1) {
                state[duplicateIndex].quantity += quantity;
            } else {
                state.push(action.payload);
            }
        },
        removeItem: (state, action) => {
            return state.filter(item => item.name !== action.payload);
        }
    }
});

export const orderActions = orderSlice.actions;
export default orderSlice;
