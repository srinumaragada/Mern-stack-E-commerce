import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    orderList: [],
    orderDetails: null
};

export const getAllOrdersByAdmin = createAsyncThunk(
    "orders/getAllOrders",
    async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders/get`);
        return response.data;
    }
);

export const getOrderDetailsByAdmin = createAsyncThunk(
    "orders/getOrderDetails",
    async (id) => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders/get/${id}`);
        return response.data;
    }
);


export const updateOrderStatus=createAsyncThunk(
  "update/updateOrderStatus",
  async ({id,orderStatus}) =>{
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`,{
      orderStatus
    });
    return response.data;
  }
)
const AdminOrderSlice = createSlice({
    name: "AdminOrders",
    initialState,
    reducers: {
        resetOrderDetails: (state) => {
            state.orderDetails = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllOrdersByAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllOrdersByAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderList = action.payload.data;
            })
            .addCase(getAllOrdersByAdmin.rejected, (state) => {
                state.isLoading = false;
                state.orderList = [];
            })
            .addCase(getOrderDetailsByAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrderDetailsByAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.orderDetails;
            })
            .addCase(getOrderDetailsByAdmin.rejected, (state) => {
                state.isLoading = false;
                state.orderDetails = null;
            });
    }
});

export const { resetOrderDetails } = AdminOrderSlice.actions;
export default AdminOrderSlice.reducer;
