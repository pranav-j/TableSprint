import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface ProductFormData {
    categoryId: number | string;
    subcategoryId: number | string;
    productName: string;
    image: string;
    status?: string;
}

// Interface for the API response
export interface Product {
    id: number;
    productName: string;
    categoryName: string;
    subcategoryName: string;
    image: string;
    status: string;
}

interface ProductState {
    fetchProductsStatus: "idle" | "pending" | "fulfilled" | "rejected";
    createProductStatus: "idle" | "pending" | "fulfilled" | "rejected";
    editProductStatus: "idle" | "pending" | "fulfilled" | "rejected";
    deleteProductStatus: "idle" | "pending" | "fulfilled" | "rejected";
    products: Product[];
    error: string | null;
}

const initialState: ProductState = {
    fetchProductsStatus: "idle",
    createProductStatus: "idle",
    editProductStatus: "idle",
    deleteProductStatus: "idle",
    products: [],
    error: null,
};

export const fetchProducts = createAsyncThunk<Product[]>(
    "products/fetchProducts", 
    async () => {
        const response = await axios.get(
            `http://localhost:3000/api/products`, 
            { withCredentials: true }
        );
        return response.data.products;
    }
);

export const createProduct = createAsyncThunk<Product, ProductFormData>(
    "products/createProduct",
    async (newProduct) => {
        const response = await axios.post(
            `http://localhost:3000/api/product`,
            newProduct,
            { withCredentials: true }
        );
        return response.data.product;
    }
);

export const editProduct = createAsyncThunk<Product, { formData: ProductFormData; productId: number | null }>(
    "products/editProduct",
    async ({ formData, productId }) => {
        const response = await axios.put(
            `http://localhost:3000/api/product/${productId}`,
            formData,
            { withCredentials: true }
        );
        return response.data.product;
    }
);

export const deleteProduct = createAsyncThunk<number, number>(
    "products/deleteProduct",
    async (productId) => {
        await axios.delete(
            `http://localhost:3000/api/product/${productId}`,
            { withCredentials: true }
        );
        return productId;
    }
);

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.fetchProductsStatus = "pending";
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.fetchProductsStatus = "fulfilled";
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.fetchProductsStatus = "rejected";
                state.error = action.error.message || "Failed to fetch products";
            })
            .addCase(createProduct.pending, (state) => {
                state.createProductStatus = "pending";
            })
            .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.createProductStatus = "fulfilled";
                state.products.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.createProductStatus = "rejected";
                state.error = action.error.message || "Failed to create product";
            })
            .addCase(editProduct.pending, (state) => {
                state.editProductStatus = "pending";
            })
            .addCase(editProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.editProductStatus = "fulfilled";
                const index = state.products.findIndex(
                    (product) => product.id === action.payload.id
                );
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(editProduct.rejected, (state, action) => {
                state.editProductStatus = "rejected";
                state.error = action.error.message || "Failed to edit product";
            })
            .addCase(deleteProduct.pending, (state) => {
                state.deleteProductStatus = "pending";
            })
            .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
                state.deleteProductStatus = "fulfilled";
                state.products = state.products.filter(
                    (product) => product.id !== action.payload
                );
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.deleteProductStatus = "rejected";
                state.error = action.error.message || "Failed to delete product";
            });
    },
});

export default productSlice.reducer;