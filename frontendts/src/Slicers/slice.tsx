import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface UserDetails {
    username: string;
    email: string;
}

const initialState: UserDetails = { username: '', email: '' };

// export const createuser: any = createAsyncThunk(
//     'user_data/createuser',
//     async (user_details: UserDetails, thunkAPI) => {
//     }
// );

const user_data_slice = createSlice({
    name: "user_data",
    initialState,
    reducers: {
        createuser: (state, actions) => {
            state = actions.payload
            console.log(actions.payload)
            axios.post("http://localhost:80/users/create_user", actions.payload);
        }
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(createuser.pending, (state) => {
    //             // Handle loading state if needed
    //         })
    //         .addCase(createuser.fulfilled, (state, action) => {
    //             state.username = action.payload.username;
    //             state.email = action.payload.email;
    //         })
    //         .addCase(createuser.rejected, (state, action) => {
    //             // Handle error state if needed
    //         });
    // }
});

export const { createuser } = user_data_slice.actions;
export const user_data_reducer = user_data_slice.reducer;