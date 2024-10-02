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
        }
    }
});

export const { setCategories, addCategory, removeCategory } = categorySlice.actions;
export default categorySlice;
