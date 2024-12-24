import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabAndFormState {
    activeTab: string;
    openForm: string | null;
};

const initialState: TabAndFormState = {
    activeTab: "Dashboard",
    openForm: null
};

const 