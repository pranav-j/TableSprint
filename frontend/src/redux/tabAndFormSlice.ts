import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabAndFormState {
    activeTab: string;
    openForm: string | null;
    editCategoryId: number | null;
    editSubCategoryId: number | null;
};

const initialState: TabAndFormState = {
    activeTab: "Dashboard",
    openForm: null,
    editCategoryId: null,
    editSubCategoryId: null,
};

const tabAndFormSlice = createSlice({
    name: "TabAndForm",
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<string>) => {
            state.activeTab = action.payload;
        },
        setOpenForm: (state, action: PayloadAction<string>) => {
            state.openForm = action.payload;
        },
        resetOpenForm: (state) => {
            state.openForm = null;
        },
        setEditCategoryId: (state, action: PayloadAction<number>) => {
            state.editCategoryId = action.payload;
        },
        resetEditCategoryId: (state) => {
            state.editCategoryId = null;
        },
        setEditSubCategoryId: (state, action: PayloadAction<number>) => {
            state.editSubCategoryId = action.payload;
        },
        resetEditSubCategoryId: (state) => {
            state.editSubCategoryId = null;
        }
    }
});

export const { 
    setActiveTab, 
    setOpenForm, 
    resetOpenForm, 
    setEditCategoryId, 
    resetEditCategoryId, 
    setEditSubCategoryId,
    resetEditSubCategoryId
} = tabAndFormSlice.actions;
export default tabAndFormSlice.reducer;