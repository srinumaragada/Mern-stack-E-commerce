import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state for the auth slice
const initialState = {
    isLoading: false,
    isAuthenticated: false,
    user: null,
    error: null, // Error state
};

// Async thunk for user registration
export const registerUserAction = createAsyncThunk(
    "auth/register",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData, {
                withCredentials: true,
            });
            return response.data; // Return response data directly
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data); // Return error from server
            } else {
                return rejectWithValue(error.message); // Return general error message
            }
        }
    }
);

// Async thunk for user login
export const loginUserAction = createAsyncThunk("auth/login", async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData, {
            withCredentials: true,
        });
        return response.data; // Return response data
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// Async thunk for checking authentication status
export const CheckAuthAction = createAsyncThunk(
    "auth/checkAuth",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/checkAuth`, {
                withCredentials: true,
            });
            return response.data.user; // Assuming API returns user data
        } catch (error) {
            return rejectWithValue(error.response.data || error.message); // Return error message
        }
    }
);

// Async thunk for user logout
export const logOut = createAsyncThunk("auth/logout", async () => {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, {
        withCredentials: true,
    });
});

// Create the auth slice
const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload; // Set authenticated state
            localStorage.setItem("user", JSON.stringify(action.payload)); // Store user data
        },
    },
    extraReducers: (builder) => {
        builder
            // Register actions
            .addCase(registerUserAction.pending, (state) => {
                state.isLoading = true;
                state.error = null; // Clear previous errors
            })
            .addCase(registerUserAction.fulfilled, (state, action) => {
                state.isLoading = false;
                // Check if the action payload contains success and data
                if (action.payload.success) {
                    state.isAuthenticated = false; // Assuming user is not authenticated right after registration
                    state.user = action.payload.data.newUser; // Correctly assign the new user data
                    state.error = null; // Clear error
                } else {
                    // If for some reason the payload does not have success, handle the error case
                    state.error = "Registration failed, please try again.";
                }
            })
            .addCase(registerUserAction.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload || "Registration failed"; // Set error message
            })
            // Login actions
            .addCase(loginUserAction.pending, (state) => {
                state.isLoading = true;
                state.error = null; // Clear previous errors
            })
            .addCase(loginUserAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = action.payload.success; // Check for successful login
                state.user = action.payload.success ? action.payload.user : null; // Set user if successful
                state.error = null; // Clear error
            })
            .addCase(loginUserAction.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload || "Login failed"; // Set error message
            })
            // Check authentication actions
            .addCase(CheckAuthAction.pending, (state) => {
                state.isLoading = true;
                state.error = null; // Clear previous errors
            })
            .addCase(CheckAuthAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload; // Update user
                state.isAuthenticated = !!action.payload; // Update authenticated state
                if (action.payload) {
                    localStorage.setItem("user", JSON.stringify(action.payload)); // Store user data
                } else {
                    localStorage.removeItem("user"); // Clear user data
                }
            })
            .addCase(CheckAuthAction.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem("user"); // Clear user data on failure
                state.error = action.payload || "Check auth failed"; // Set error message
            })
            // Logout actions
            .addCase(logOut.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false; // Reset authentication state
                state.user = null; // Clear user data
                state.error = null; // Clear error
            });
    },
});

// Export the setUser action
export const { setUser } = AuthSlice.actions;

// Export the reducer
export default AuthSlice.reducer;
