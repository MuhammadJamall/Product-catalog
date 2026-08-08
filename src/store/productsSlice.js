import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../utils/api"; // ✅ CHANGED: Import our API utility

// ✅ REMOVED: Hardcoded TOKEN variable
// const TOKEN = "YOUR_TOKEN_HERE"; ← DELETE THIS LINE!

const API_URL = "/products/"; // ✅ CHANGED: Relative URL (base URL in api.js)

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      // ✅ CHANGED: Use api.get() which auto-adds auth header
      const response = await api.get(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Something went wrong"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      // ✅ CHANGED: Use api.post()
      const response = await api.post(API_URL, productData);

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Something went wrong"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, ...updatedData }, { rejectWithValue }) => {
    try {
      // ✅ CHANGED: Use api.put()
      const res = await api.put(`${API_URL}${id}`, updatedData);

      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err);
      }

      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      // ✅ CHANGED: Use api.delete()
      const response = await api.delete(`${API_URL}${id}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        return rejectWithValue(
          errorData?.detail || errorData || "Failed to delete product"
        );
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete product");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      // ✅ CHANGED: Use api.get()
      const res = await api.get(`${API_URL}${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    selectedProduct: null,
    status: "idle",
    error: null,
    createStatus: "idle",
    createError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH PRODUCTS
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // CREATE PRODUCT
      .addCase(createProduct.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      })

      // UPDATE PRODUCT
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload.data || action.payload;
        const index = state.items.findIndex(p => String(p.id) === String(updated.id));
        if (index !== -1) {
          state.items[index] = updated;
        }
        if (state.selectedProduct && String(state.selectedProduct.id) === String(updated.id)) {
          state.selectedProduct = updated;
        }
      })

      // DELETE PRODUCT
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      })

      // FETCH PRODUCT BY ID
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedProduct = action.payload.data || action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export default productsSlice.reducer;