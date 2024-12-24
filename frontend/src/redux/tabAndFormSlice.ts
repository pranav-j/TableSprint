import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabAndFormState {
    activeTab: string;
    openForm: string | null;
};

const initialState: TabAndFormState = {
    activeTab: "Dashboard",
    openForm: null
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
    }
});

export const { setActiveTab, setOpenForm, resetOpenForm } = tabAndFormSlice.actions;
export default tabAndFormSlice.reducer;