import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addCardDB: any = createAsyncThunk(
  "addCard",
  async (objectid: any, thunkAPI) => {
    await axios.post("http://localhost:3090/cards/create_card", objectid);
    return objectid;
  }
);

export const removeCardDB: any = createAsyncThunk(
  "removeCard",
  async (objectid: any, thunkAPI) => {
    await axios.post("http://localhost:3090/cards/delete_card", objectid);
    return objectid;
  }
);

export const updateCardDB: any = createAsyncThunk(
  "updateCard",
  async (objectid: any, thunkAPI) => {
    await axios.post("http://localhost:3090/cards/update_card", objectid);
    return objectid;
  }
);
