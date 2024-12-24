import { configureStore } from "@reduxjs/toolkit";
import tabAndFormReducer from "../redux/tabAndFormSlice";

const store = configureStore({
    reducer: {
        tabAndFormReducer,
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;