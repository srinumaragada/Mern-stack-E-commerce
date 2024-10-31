import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState={
    isLoading:false,
    productList:[],
    productDetails:{}
}


 export const fetchShoppingProducts=createAsyncThunk(
    "/products/fetchallproducts",
    async({filterParams,sortParams})=>{

        const query=new URLSearchParams({
            ...filterParams,
            sortby:sortParams||"price-lowtohigh"
        })
        console.log(query.toString());
        
        const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`)
        return response.data
    }
)

export const getAllProductDetails = createAsyncThunk(
    "products/getAllProductDetails",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`, {
                timeout: 15000  // Increased timeout to 15 seconds
            });
            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.error('Request canceled:', error.message);
            } else if (error.code === 'ECONNABORTED') {
                console.error('Request timed out:', error.message);  // Handle timeout
            } else {
                console.error('Error fetching product details:', error.message);
            }

            return rejectWithValue(
                error.response ? error.response.data : "An error occurred while fetching the product details."
            );
        }
    }
);

const fetchAllShopProducts=createSlice({
    name:"shop",
    initialState,
    reducers:{
        setProductDetails: (state) => {
            state.productDetails = null;
          },
    },
    extraReducers:(builder)=>{
                builder.addCase(fetchShoppingProducts.pending,(state)=>{
                    state.isLoading=true
                }).addCase(fetchShoppingProducts.fulfilled,(state,action)=>{
                    state.isLoading=false,                  
                    state.productList=action.payload.data
                    console.log(action.payload);  
                }).addCase(fetchShoppingProducts.rejected,(state)=>{
                    state.isLoading=false
                }) .addCase(getAllProductDetails.pending, (state) => {
                    console.log('Fetching product details...');
                    state.isLoading = true;
                    state.productDetails = null;  // Optionally reset productDetails on new request
                })
                .addCase(getAllProductDetails.fulfilled, (state, action) => {
                    console.log('Product details fetched successfully:', action.payload);  // Debug the payload
                    state.isLoading = false;
                    state.productDetails = action.payload.data;  // Make sure this matches your API response structure
                })
                .addCase(getAllProductDetails.rejected, (state, action) => {
                    console.error('Failed to fetch product details:', action.error.message);
                    state.isLoading = false;
                    state.productDetails = null;  // Set to null on error
                });
    }
})

export const { setProductDetails } = fetchAllShopProducts.actions;
export default fetchAllShopProducts.reducer