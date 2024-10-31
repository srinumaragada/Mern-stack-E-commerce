import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState={
    isLoading:false,
    approvalURL:null,
    orderId:null,
    orderList: [],
    orderDetails: null,
}

export const CreateOrder=createAsyncThunk(
    "order/createOrder",
    async(orderData)=>{   
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/orders/create`,orderData)
        return response.data
    }
)

export const captureOrder= createAsyncThunk(
    "order/captureOrder",
    async({paymentId,payerId,orderId})=>{
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/orders/capture`,{
            paymentId,payerId,orderId
        })
        return response.data
    }
)

export const getAllOrdersByUserId = createAsyncThunk(
    "/order/getAllOrdersByUserId",
    async (userId) => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/orders/list/${userId}`
      );
  
      return response.data;
    }
  );
  
  export const getOrderDetails = createAsyncThunk(
    "/order/getOrderDetails",
    async (id) => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/orders/details/${id}`
      );
  
      return response.data;
    }
  );
  
const OrderSlice=createSlice({
        name:"ShoopingOrderSlice",
        initialState,
        reducers:{
          resetOrderDetails:(state)=>{
            state.orderDetails=null
          }
        },
        extraReducers:(builder)=>{
                builder.addCase(CreateOrder.pending,(state)=>{
                    state.isLoading=true
                }).addCase(CreateOrder.fulfilled,(state,action)=>{
                    state.isLoading=true
                    state.approvalURL=action.payload.approvalURL
                    state.orderId=action.payload.orderId
                    sessionStorage.setItem("currentOrderId",JSON.stringify(action.payload.orderId))
                }).addCase(CreateOrder.rejected,(state)=>{
                    state.isLoading=true
                    state.approvalURL=null
                    state.orderId=null
                }) .addCase(getAllOrdersByUserId.pending, (state) => {
                    state.isLoading = true;
                  })
                  .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.orderList = action.payload.data;
                  })
                  .addCase(getAllOrdersByUserId.rejected, (state) => {
                    state.isLoading = false;
                    state.orderList = [];
                  })
                  .addCase(getOrderDetails.pending, (state) => {
                    state.isLoading = true;
                  })
                  .addCase(getOrderDetails.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.orderDetails = action.payload.data;
                  })
                  .addCase(getOrderDetails.rejected, (state) => {
                    state.isLoading = false;
                    state.orderDetails = null;
                  });
        }
})

export const {resetOrderDetails}=OrderSlice.actions
export default OrderSlice.reducer