import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Interface for the form input
export interface SubcategoryFormData {
    categoryId: number | string;
    subcategoryName: string;
    sequence: number;
    image: string;
}

// Interface for the API response
export interface Subcategory {
    id: number;
    subcategoryName: string;
    categoryName: string;
    sequence: number;
    image: string;
    status: string;
}

interface SubcategoryState {
    fetchSubcategoriesStatus: "idle" | "pending" | "fulfilled" | "rejected";
    createSubcategoryStatus: "idle" | "pending" | "fulfilled" | "rejected";
    editSubcategoryStatus: "idle" | "pending" | "fulfilled" | "rejected";
    deleteSubcategoryStatus: "idle" | "pending" | "fulfilled" | "rejected";
    subcategories: Subcategory[];
    error: string | null;
}

const initialState: SubcategoryState = {
    fetchSubcategoriesStatus: "idle",
    createSubcategoryStatus: "idle",
    editSubcategoryStatus: "idle",
    deleteSubcategoryStatus: "idle",
    subcategories: [],
    error: null,
};

export const fetchSubcategories = createAsyncThunk<Subcategory[]>(
    "subcategories/fetchSubcategories", 
    async () => {
        const response = await axios.get(
            `http://localhost:3000/api/subcategories`, 
            { withCredentials: true }
        );
        return response.data.subcategories;
    }
);

export const createSubcategory = createAsyncThunk<Subcategory, SubcategoryFormData>(
    "subcategories/createSubcategory",
    async (newSubcategory) => {
        const response = await axios.post(
            `http://localhost:3000/api/subcategory`,
            newSubcategory,
            { withCredentials: true }
        );
        return response.data.subcategory;
    }
);

export const editSubcategory = createAsyncThunk<Subcategory, { formData: SubcategoryFormData; subcategoryId: number | null }>(
    "subcategories/editSubcategory",
    async ({ formData, subcategoryId }) => {
        const response = await axios.put(
            `http://localhost:3000/api/subcategory/${subcategoryId}`,
            formData,
            { withCredentials: true }
        );
        return response.data.subcategory;
    }
);

export const deleteSubcategory = createAsyncThunk<number, number>(
    "subcategories/deleteSubcategory",
    async (subcategoryId) => {
        await axios.delete(
            `http://localhost:3000/api/subcategory/${subcategoryId}`,
            { withCredentials: true }
        );
        return subcategoryId;
    }
);

const subcategorySlice = createSlice({
    name: "subcategories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubcategories.pending, (state) => {
                state.fetchSubcategoriesStatus = "pending";
            })
            .addCase(fetchSubcategories.fulfilled, (state, action: PayloadAction<Subcategory[]>) => {
                state.fetchSubcategoriesStatus = "fulfilled";
                state.subcategories = action.payload;
            })
            .addCase(fetchSubcategories.rejected, (state, action) => {
                state.fetchSubcategoriesStatus = "rejected";
                state.error = action.error.message || "Failed to fetch subcategories";
            })
            .addCase(createSubcategory.pending, (state) => {
                state.createSubcategoryStatus = "pending";
            })
            .addCase(createSubcategory.fulfilled, (state, action: PayloadAction<Subcategory>) => {
                state.createSubcategoryStatus = "fulfilled";
                state.subcategories.push(action.payload);
            })
            .addCase(createSubcategory.rejected, (state, action) => {
                state.createSubcategoryStatus = "rejected";
                state.error = action.error.message || "Failed to create subcategory";
            })
            .addCase(editSubcategory.pending, (state) => {
                state.editSubcategoryStatus = "pending";
            })
            .addCase(editSubcategory.fulfilled, (state, action: PayloadAction<Subcategory>) => {
                state.editSubcategoryStatus = "fulfilled";
                const index = state.subcategories.findIndex(
                    (subcategory) => subcategory.id === action.payload.id
                );
                if (index !== -1) {
                    state.subcategories[index] = action.payload;
                }
            })
            .addCase(editSubcategory.rejected, (state, action) => {
                state.editSubcategoryStatus = "rejected";
                state.error = action.error.message || "Failed to edit subcategory";
            })
            .addCase(deleteSubcategory.pending, (state) => {
                state.deleteSubcategoryStatus = "pending";
            })
            .addCase(deleteSubcategory.fulfilled, (state, action: PayloadAction<number>) => {
                state.deleteSubcategoryStatus = "fulfilled";
                state.subcategories = state.subcategories.filter(
                    (subcategory) => subcategory.id !== action.payload
                );
            })
            .addCase(deleteSubcategory.rejected, (state, action) => {
                state.deleteSubcategoryStatus = "rejected";
                state.error = action.error.message || "Failed to delete subcategory";
            });
    },
});

export default subcategorySlice.reducer;