// dealSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    deals: [],
    // You can add other state properties here if needed
};

const dealSlice = createSlice({
    name: 'deals',
    initialState,
    reducers: {
        // Action to set deals (e.g., after fetching from the server)
        setDeals: (state, action) => {
            state.deals = action.payload; // Store the fetched deals in the deals array
        },

        // Action to remove a product from a deal
        removeProductFromDeal: (state, action) => {
            const { dealId, productId } = action.payload;
            const deal = state.deals.find(deal => deal._id === dealId);
            if (deal) {
                deal.products = deal.products.filter(product => product._id !== productId);
            }
        },

        // Action to add a product to a deal
        addProductToDeal: (state, action) => {
            const { dealId, product } = action.payload;
            const deal = state.deals.find(deal => deal._id === dealId);
            if (deal) {
                deal.products.push(product); // Add the product to the existing deal
            }
        },
    },
});

// Export actions
export const { setDeals, removeProductFromDeal, addProductToDeal } = dealSlice.actions;

// Export reducer
export default dealSlice; // Make sure to export the reducer
