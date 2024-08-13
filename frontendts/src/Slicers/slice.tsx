import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import cookie from "cookie";

interface UserDetails {
  username: string;
  email: string;
}

interface initialInterface {
  userData: UserDetails;
  data: any[];
  Object_id: string;
  transitions: any;
}

const initialState: initialInterface = {
  userData: { username: "", email: "" },
  data: [],
  Object_id: "",
  transitions: {
    sidebutton: true,
  },
};

export const createuser: any = createAsyncThunk(
  "user_data/createuser",
  async (user_details: UserDetails, thunkAPI) => {
    const response = await axios.post(
      "http://localhost:3090/users/create_user",
      user_details
    );
    return response.data;
  }
);

export const readuser: any = createAsyncThunk(
  "user_data/readuser",
  async (objectid: any, thunkAPI) => {
    const response = await axios.post(
      "http://localhost:3090/users/read_user",
      objectid
    );
    return { data: response.data, Object_id: objectid };
  }
);

export const removeWorkspaceDB: any = createAsyncThunk(
  "user_data/removeuser",
  async (objectid: any, thunkAPI) => {
    console.log(objectid);
    const response = await axios.post(
      "http://localhost:3090/workspaces/delete_workspace",
      objectid
    );
    return objectid.wname;
  }
);

const user_data_slice = createSlice({
  name: "user_data",
  initialState,
  reducers: {
    sidepanelHandle: (state, action) => {
      state.transitions.sidebutton = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createuser.fulfilled, (state, action) => {
      state.userData = action.meta.arg;
      state.Object_id = action.payload;
      document.cookie = cookie.serialize("id", action.payload, {
        path: "/",
        expires: new Date("9999-12-31T23:59:59Z"),
      });
    });
    builder.addCase(readuser.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.Object_id = action.payload.Object_id.id;
    });
    builder.addCase(removeWorkspaceDB.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (workspace: any) => Object.keys(workspace)[0] !== action.payload
      );
    });
  },
});

export const user_data_reducer = user_data_slice.reducer;
export const { sidepanelHandle } = user_data_slice.actions;
