import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabAndFormState {
    activeTab: string;
    openForm: string | null;
    editCategoryId: number | null;
    editSubCategoryId: number | null;
    editProductId: number | null;
    deleteId: number | null;
    searchParam: string | null;
    showLogoutModal: boolean
};

const initialState: TabAndFormState = {
    activeTab: "Dashboard",
    openForm: null,
    editCategoryId: null,
    editSubCategoryId: null,
    editProductId: null,
    deleteId: null,
    searchParam: null,
    showLogoutModal: false
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
        },
        setEditProductId: (state, action: PayloadAction<number>) => {
            state.editProductId = action.payload;
        },
        resetEditProductId: (state) => {
            state.editProductId = null;
        },
        setDeleteId: (state, action: PayloadAction<number>) => {
            state.deleteId = action.payload;
        },
        resetDeleteId: (state) => {
            state.deleteId = null;
        },
        setSearchParam: (state, action: PayloadAction<string>) => {
            state.searchParam = action.payload;
        },
        resetSearchParam: (state) => {
            state.searchParam = null;
        },
        toggleLogoutModal: (state) => {
            state.showLogoutModal = !state.showLogoutModal
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
    resetEditSubCategoryId,
    setEditProductId,
    resetEditProductId,
    setDeleteId,
    resetDeleteId,
    setSearchParam,
    resetSearchParam,
    toggleLogoutModal
} = tabAndFormSlice.actions;
export default tabAndFormSlice.reducer;