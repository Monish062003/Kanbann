import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createGroup: any = createAsyncThunk(
  "createGroup",
  async (objectid: any, thunkAPI) => {
    // await axios.post("http://localhost:3090/groups/create_group", objectid);
    return objectid;
  }
);

export const joinGroup: any = createAsyncThunk(
  "joinGroup",
  async (objectid: any, thunkAPI) => {
    // await axios.post("http://localhost:3090/groups/join_group", objectid);
    return objectid;
  }
);
