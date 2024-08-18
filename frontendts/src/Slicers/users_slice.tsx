import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { UserDetails } from "./slice";

export const createUser: any = createAsyncThunk(
  "createUser",
  async (user_details: UserDetails, thunkAPI) => {
    const response = await axios.post(
      "http://localhost:3090/users/create_user",
      user_details
    );
    return response.data;
  }
);

export const readUser: any = createAsyncThunk(
  "readUser",
  async (objectid: any, thunkAPI) => {
    const response = await axios.post(
      "http://localhost:3090/users/read_user",
      objectid
    );
    return { data: response.data, Object_id: objectid };
  }
);
