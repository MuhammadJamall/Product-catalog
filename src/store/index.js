import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import cartReducer from "./cartSlice";
import categoriesReducer from "./categoriesSlice";
import taskReducer from "./taskSlice";
import authReducer from "./authSlice"; // ✅ ADDED: Import auth reducer

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    categories: categoriesReducer,
    tasks: taskReducer,
    auth: authReducer, // ✅ ADDED: Add auth to store
  },
});

export default store;