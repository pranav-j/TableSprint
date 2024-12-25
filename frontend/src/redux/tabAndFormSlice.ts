import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabAndFormState {
    activeTab: string;
    openForm: string | null;
    editCategoryId: number | null;
};

const initialState: TabAndFormState = {
    activeTab: "Dashboard",
    openForm: null,
    editCategoryId: null,
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
        }
    }
});

export const { setActiveTab, setOpenForm, resetOpenForm, setEditCategoryId, resetEditCategoryId } = tabAndFormSlice.actions;
export default tabAndFormSlice.reducer;