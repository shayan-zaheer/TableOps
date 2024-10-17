import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        deliveryOrders: [],
        dineInOrders: [],  // New state for dine-in orders
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
            state.orders = state.orders.filter(item => item.name !== action.payload);
        },
        removeOrder: (state, action) => {
            state.orders = [];
        },
        addDeliveryOrder(state, action) {
            state.deliveryOrders.push(action.payload);
        },
        updateDeliveryOrders(state, action) {
            const updatedOrder = action.payload;
            const index = state.deliveryOrders.findIndex(order => order._id === updatedOrder._id);
            if (index !== -1) {
                state.deliveryOrders[index] = updatedOrder;
            }
        },
        // Reducers for dine-in orders
        addDineInOrder(state, action) {
            state.dineInOrders.push(action.payload);
        },
        updateDineInOrders(state, action) {
            const updatedOrder = action.payload;
            const index = state.dineInOrders.findIndex(order => order._id === updatedOrder._id);
            if (index !== -1) {
                state.dineInOrders[index] = updatedOrder;
            }
        }
    }
});

export const orderActions = orderSlice.actions;
export default orderSlice;
