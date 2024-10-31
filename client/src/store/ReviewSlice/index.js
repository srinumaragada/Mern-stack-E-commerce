import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    isLoading: false,
    reviewList: []
}

export const addReview = createAsyncThunk(
    "review/addReview",
    async ({ productId, userId,userName ,reviewMessage, reviewValue }) => {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/review/add`, {
            productId, userId, reviewMessage, reviewValue,userName
        })
        return response.data
    }
)
export const getReviews = createAsyncThunk(
    "review/getReview",
    async (id) => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/review/${id}`)
        return response.data
    }
)

const ReviewSlice = createSlice({
    name: "Reviews",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addReview.pending, (state) => {
            state.isLoading = true
        }).addCase(addReview.fulfilled, (state, action) => {
            state.isLoading = false,
                state.reviewList = action.payload.data
        }).addCase(addReview.rejected, (state, action) => {
            state.isLoading = true,
                state.reviewList = []
        }).addCase(getReviews.pending, (state) => {
            state.isLoading = true
        }).addCase(getReviews.fulfilled, (state,action) => {
            state.isLoading = true
            state.reviewList=action.payload.data
        }).addCase(getReviews.rejected, (state,action) => {
            state.isLoading = true,
            state.reviewList=[]
        })
    }
})


export default ReviewSlice.reducer