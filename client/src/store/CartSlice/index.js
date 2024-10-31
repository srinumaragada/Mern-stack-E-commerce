import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";



const initialState={
    isLoading:false,
    cartItems:[]
}

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ UserId, ProductId, quantity }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/cart/add`, {
        UserId, ProductId, quantity
      });
      return response.data;
    } catch (error) {
      console.error("Error adding product to cart:", error.response.data);
      return rejectWithValue(error.response.data);  // Pass the error message from backend
    }
  }
);



export const fetchCartDetails=createAsyncThunk(
    "cart/fetchCartDetails",
    async (UserId)=>{
        const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/cart/get/${UserId}`)
        return response.data
    }
)

export const UpdateCartDetails=createAsyncThunk(
    "cart/UpdateCartDetails",
    async({UserId,ProductId,quantity})=>{
        const response=await axios.put(`${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart`,{
            UserId,ProductId,quantity
        })
        return response?.data
    }
)
export const deleteCartItem = createAsyncThunk(
    "cart/deleteCartItem",
    async ({ UserId, ProductId }) => {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/${UserId}/${ProductId}`
      );
  
      return response.data;
    }
  );
const CartSlice=createSlice({
    name:"cart",
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
          .addCase(addToCart.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(addToCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data;
          })
          .addCase(addToCart.rejected, (state,action) => {
            state.isLoading = false;
            state.cartItems = [];
            console.error("Error adding to cart:", action.error.message);
          })
          .addCase(fetchCartDetails.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(fetchCartDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data;
          })
          .addCase(fetchCartDetails.rejected, (state) => {
            state.isLoading = false;
            state.cartItems = [];
          })
          .addCase(UpdateCartDetails.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(UpdateCartDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data;
          })
          .addCase(UpdateCartDetails.rejected, (state) => {
            state.isLoading = false;
            state.cartItems = [];
          })
          .addCase(deleteCartItem.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(deleteCartItem.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data;
          })
          .addCase(deleteCartItem.rejected, (state) => {
            state.isLoading = false;
            state.cartItems = [];
          });
      },
    });
    
    export default CartSlice.reducer;
