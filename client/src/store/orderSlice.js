import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        deliveryOrders: [],
    },
    reducers: {
        addItem: (state, action) => {
            const { name, price, quantity } = action.payload;
            const duplicateIndex = state.orders.findIndex(item => item.name === name);

            if (duplicateIndex !== -1) {
                state.orders[duplicateIndex].quantity += quantity;
            } else {
                state.orders.push(action.payload);
            }
        },
        removeItem: (state, action) => {
            return state.orders.filter(item => item.name !== action.payload);
        },
        removeOrder: (state, action) => {
            state.orders = [];
        },
        addDeliveryOrder(state, action) {
            state.deliveryOrders.push(action.payload);
        },
        updateDeliveryOrders(state, action) {
            const updatedDeliveryOrders = action.payload;
            state.deliveryOrders = updatedDeliveryOrders;
        },
    }
});

export const orderActions = orderSlice.actions;
export default orderSlice;
