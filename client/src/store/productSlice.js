import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        categories: [],
        filteredProducts: [],
        selectedCategory: '',
    },
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
            state.filteredProducts = state.products.filter(
                product => product.category === action.payload
            );
        },
        clearFilteredProducts: (state) => {
            state.filteredProducts = [];
        }
    },
});

export const { setProducts, setCategories, setSelectedCategory, clearFilteredProducts } = productSlice.actions;

export default productSlice;
