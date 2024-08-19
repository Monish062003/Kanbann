import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addTaskDB: any = createAsyncThunk(
  "addTask",
  async (objectid: any, thunkAPI) => {
    await axios.post("http://localhost:3090/tasks/create_task", objectid);
    return objectid;
  }
);

export const removeTaskDB: any = createAsyncThunk(
  "removeTask",
  async (objectid: any, thunkAPI) => {
    await axios.post("http://localhost:3090/tasks/delete_task", objectid);
    return objectid;
  }
);

export const updateTaskDB: any = createAsyncThunk(
  "updateTask",
  async (objectid: any, thunkAPI) => {
    await axios.post("http://localhost:3090/tasks/update_task", objectid);
    return objectid;
  }
);
