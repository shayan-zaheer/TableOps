// src/features/categorySlice.js
import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name: "categories",
    initialState: [],
    reducers: {
        setCategories: (state, action) => {
            return action.payload;
        },
        addCategory: (state, action) => {
            state.push(action.payload);
        },
        removeCategory: (state, action) => {
            return state.filter(category => category._id !== action.payload);
        },
        removeProductFromCategory: (state, action) => {
            const { productId, categoryId } = action.payload;

            const category = state.find(category => category._id === categoryId);
            if (category) {
                category.products = category.products.filter(product => product._id !== productId);
            }
        }
    }
});


export const { setCategories, addCategory, removeCategory, removeProductFromCategory } = categorySlice.actions;
export default categorySlice;
