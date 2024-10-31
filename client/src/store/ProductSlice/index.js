import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

// Thunk to add a new product
export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (productsformdata) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/products/add`,
      productsformdata,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
);

// Thunk to fetch all products
export const fetchAllProducts = createAsyncThunk(
  "/products/fetchallproducts",
  async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/get`);
    return response.data;
  }
);

// Thunk to edit products
export const editProducts = createAsyncThunk(
  "/products/editproducts",
  async ({ id, productsformdata }) => {
    console.log("Sending data to backend:", { id, productsformdata }); // Check if productsformdata is correctly passed
    
    if (!productsformdata) {
      console.warn("Error: productsformdata is undefined.");
      return { success: false, message: "Invalid data" };
    }

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}0/api/admin/products/edit/${id}`,
      productsformdata,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
);

// Thunk to delete a product
export const deleteproduct = createAsyncThunk(
  "/products/deleteproduct",
  async (id) => {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`);
    return response.data;
  }
);

const ProductSlice = createSlice({
  name: "adminproducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch products
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.isLoading = true;
    }).addCase(fetchAllProducts.fulfilled, (state, action) => {
      console.log(action.payload); // Check response structure
      state.isLoading = false;
      // Assign the correct data from backend
      state.productList = action.payload.data.fetchProductDetails;
    }).addCase(fetchAllProducts.rejected, (state) => {
      state.isLoading = false;
      state.productList = [];
    });
  },
});

export default ProductSlice.reducer;













