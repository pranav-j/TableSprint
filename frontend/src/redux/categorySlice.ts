// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";

// export interface Category {
//     id: number;
//     categoryName: string;
//     sequence: number;
//     image: string;
//     status: string;
// }

// interface CategoryState {
//     fetchCategoriesStatus: "idle" | "pending" | "fulfilled" | "rejected";
//     createCategoryStatus: "idle" | "pending" | "fulfilled" | "rejected";
//     editCategoryStatus: "idle" | "pending" | "fulfilled" | "rejected";
//     deleteCategoryStatus: "idle" | "pending" | "fulfilled" | "rejected";
//     categories: Category[];
//     error: string | null;
// }

// const initialState: CategoryState = {
//     fetchCategoriesStatus: "idle",
//     createCategoryStatus: "idle",
//     editCategoryStatus: "idle",
//     deleteCategoryStatus: "idle",
//     categories: [],
//     error: null,
// };

// export const fetchCategories = createAsyncThunk<Category[]>("categories/fetchCategories", async () => {
//     const response = await axios.get(`http://localhost:3000/api/categories`, { withCredentials: true });
//     return response.data.categories;
// });

// export const createCategory = createAsyncThunk<Category, Omit<Category, "id">>("categories/createCategory", async (newCategory) => {
//     const response = await axios.post(`http://localhost:3000/api/category`, newCategory, { withCredentials: true });
//     return response.data.category;
// });

// export const editCategory = createAsyncThunk<Category, Category>("categories/editCategory", async (updatedCategory) => {
//     const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${updatedCategory.id}`, updatedCategory, { withCredentials: true });
//     return response.data;
// });

// export const deleteCategory = createAsyncThunk<number, number>("categories/deleteCategory", async (categoryId) => {
//     await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${categoryId}`, { withCredentials: true });
//     return categoryId;
// });

// const categorySlice = createSlice({
//     name: "categories",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchCategories.pending, (state) => {
//                 state.fetchCategoriesStatus = "pending";
//             })
//             .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
//                 state.fetchCategoriesStatus = "fulfilled";
//                 state.categories = action.payload;
//             })
//             .addCase(fetchCategories.rejected, (state, action) => {
//                 state.fetchCategoriesStatus = "rejected";
//                 state.error = action.error.message || "Failed to fetch categories";
//             })
//             .addCase(createCategory.pending, (state) => {
//                 state.createCategoryStatus = "pending";
//             })
//             .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
//                 state.createCategoryStatus = "fulfilled";
//                 state.categories.push(action.payload);
//             })
//             .addCase(createCategory.rejected, (state, action) => {
//                 state.createCategoryStatus = "rejected";
//                 state.error = action.error.message || "Failed to create category";
//             })
//             .addCase(editCategory.pending, (state) => {
//                 state.editCategoryStatus = "pending";
//             })
//             .addCase(editCategory.fulfilled, (state, action: PayloadAction<Category>) => {
//                 state.editCategoryStatus = "fulfilled";
//                 const index = state.categories.findIndex((category) => category.id === action.payload.id);
//                 if (index !== -1) {
//                     state.categories[index] = action.payload;
//                 }
//             })
//             .addCase(editCategory.rejected, (state, action) => {
//                 state.editCategoryStatus = "rejected";
//                 state.error = action.error.message || "Failed to edit category";
//             })
//             .addCase(deleteCategory.pending, (state) => {
//                 state.deleteCategoryStatus = "pending";
//             })
//             .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<number>) => {
//                 state.deleteCategoryStatus = "fulfilled";
//                 state.categories = state.categories.filter((category) => category.id !== action.payload);
//             })
//             .addCase(deleteCategory.rejected, (state, action) => {
//                 state.deleteCategoryStatus = "rejected";
//                 state.error = action.error.message || "Failed to delete category";
//             });
//     },
// });

// export default categorySlice.reducer;


import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Category {
    id: number;
    categoryName: string;
    sequence: number;
    image: string;
    status: string;
}

interface CategoryState {
    fetchCategoriesStatus: "idle" | "pending" | "fulfilled" | "rejected";
    createCategoryStatus: "idle" | "pending" | "fulfilled" | "rejected";
    editCategoryStatus: "idle" | "pending" | "fulfilled" | "rejected";
    deleteCategoryStatus: "idle" | "pending" | "fulfilled" | "rejected";
    categories: Category[];
    error: string | null;
}

const initialState: CategoryState = {
    fetchCategoriesStatus: "idle",
    createCategoryStatus: "idle",
    editCategoryStatus: "idle",
    deleteCategoryStatus: "idle",
    categories: [],
    error: null,
};

export const fetchCategories = createAsyncThunk<Category[]>(
    "categories/fetchCategories", 
    async () => {
        const response = await axios.get(`http://localhost:3000/api/categories`, { withCredentials: true });
        return response.data.categories;
    }
);

export const createCategory = createAsyncThunk<Category, Omit<Category, "id">>(
    "categories/createCategory", 
    async (newCategory) => {
        const response = await axios.post(`http://localhost:3000/api/category`, newCategory, { withCredentials: true });
        return response.data.category;
    }
);

// Updated editCategory thunk to accept FormData and categoryId
export const editCategory = createAsyncThunk<
    Category,
    { formData: FormData; categoryId: number }
>("categories/editCategory", async ({ formData, categoryId }) => {
    const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${categoryId}`,
        formData,
        {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data.category;
});

export const deleteCategory = createAsyncThunk<number, number>(
    "categories/deleteCategory", 
    async (categoryId) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${categoryId}`, { withCredentials: true });
        return categoryId;
    }
);

const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.fetchCategoriesStatus = "pending";
            })
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.fetchCategoriesStatus = "fulfilled";
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.fetchCategoriesStatus = "rejected";
                state.error = action.error.message || "Failed to fetch categories";
            })
            .addCase(createCategory.pending, (state) => {
                state.createCategoryStatus = "pending";
            })
            .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
                state.createCategoryStatus = "fulfilled";
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.createCategoryStatus = "rejected";
                state.error = action.error.message || "Failed to create category";
            })
            .addCase(editCategory.pending, (state) => {
                state.editCategoryStatus = "pending";
            })
            .addCase(editCategory.fulfilled, (state, action: PayloadAction<Category>) => {
                state.editCategoryStatus = "fulfilled";
                const index = state.categories.findIndex((category) => category.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(editCategory.rejected, (state, action) => {
                state.editCategoryStatus = "rejected";
                state.error = action.error.message || "Failed to edit category";
            })
            .addCase(deleteCategory.pending, (state) => {
                state.deleteCategoryStatus = "pending";
            })
            .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<number>) => {
                state.deleteCategoryStatus = "fulfilled";
                state.categories = state.categories.filter((category) => category.id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.deleteCategoryStatus = "rejected";
                state.error = action.error.message || "Failed to delete category";
            });
    },
});

export default categorySlice.reducer;