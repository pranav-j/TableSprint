import { configureStore } from "@reduxjs/toolkit";
import tabAndFormReducer from "./tabAndFormSlice";
import categoryReducer from "./categorySlice";
import subcategoryReducer from "./subcategorySlice";
import productReducer from "./productSlice";

const store = configureStore({
    reducer: {
        tabAndFormReducer,
        categoryReducer,
        subcategoryReducer,
        productReducer,
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;