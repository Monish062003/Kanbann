import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addWorkspaceDB: any = createAsyncThunk(
  "addWorkspace",
  async (objectid: any, thunkAPI) => {
    await axios.post(
      "http://localhost:3090/workspaces/create_workspace",
      objectid
    );
    return objectid;
  }
);

export const removeWorkspaceDB: any = createAsyncThunk(
  "removeWorkspace",
  async (objectid: any, thunkAPI) => {
    console.log(objectid);
    await axios.post(
      "http://localhost:3090/workspaces/delete_workspace",
      objectid
    );
    return objectid;
  }
);

export const updateWorkspaceDB: any = createAsyncThunk(
  "updateWorkspace",
  async (objectid: any, thunkAPI) => {
    await axios.post(
      "http://localhost:3090/workspaces/update_workspace",
      objectid
    );
    return objectid;
  }
);
