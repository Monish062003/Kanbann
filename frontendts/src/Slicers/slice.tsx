import { createSlice } from "@reduxjs/toolkit";
import cookie from "cookie";
import { createUser, readUser } from "./users_slice";
import {
  addWorkspaceDB,
  updateWorkspaceDB,
  removeWorkspaceDB,
} from "./workspace_slice";

import { addCardDB, updateCardDB, removeCardDB } from "./card_slice";
import { addTaskDB, updateTaskDB, removeTaskDB } from "./task_slice";

export interface UserDetails {
  username: string;
  email: string;
}

interface initialInterface {
  userData: UserDetails;
  data: any[];
  Object_id: string;
  transitions: any;
  currentWorkspace: number;
}

const initialState: initialInterface = {
  userData: { username: "", email: "" },
  data: [],
  Object_id: "",
  transitions: {
    sidebutton: true,
  },
  currentWorkspace: 0,
};

const user_data_slice = createSlice({
  name: "user_data",
  initialState,
  reducers: {
    sidepanelHandle: (state, action) => {
      state.transitions.sidebutton = action.payload;
    },
    changeCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.userData = action.meta.arg;
      state.Object_id = action.payload;
      document.cookie = cookie.serialize("id", action.payload, {
        path: "/",
        expires: new Date("9999-12-31T23:59:59Z"),
      });
    });
    builder.addCase(readUser.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.Object_id = action.payload.Object_id.id;
    });
    builder.addCase(removeWorkspaceDB.fulfilled, (state, action) => {
      state.data = state.data.filter((workspace: any, index: number) => {
        if (
          Object.keys(workspace)[0] !== action.payload.wname ||
          action.payload.w_index !== index
        )
          return workspace;
      });
    });
    builder.addCase(addWorkspaceDB.fulfilled, (state, action) => {
      state.data.push({
        Workspace: [{ "Card 1": [{ "Task 1": [] }] }, action.payload.wid],
      });
    });
    builder.addCase(updateWorkspaceDB.fulfilled, (state: any, action) => {
      const { oldname, newname, w_index } = action.payload;
      state.data[w_index] = { [newname]: state.data[w_index][oldname] };
    });

    builder.addCase(addCardDB.fulfilled, (state: any, action) => {
      const { workspace_index, workspace_name } = action.payload;

      state.data[workspace_index][workspace_name].push({
        "Card Name": [{ "Task 1": [] }, "Card Description"],
      });
    });

    builder.addCase(removeCardDB.fulfilled, (state: any, action) => {
      const { workspace_index, card_index, workspace_name } = action.payload;
      state.data[workspace_index][workspace_name] = state.data[workspace_index][
        workspace_name
      ].filter((_card: any, index: number) => index !== card_index);
    });

    builder.addCase(updateCardDB.fulfilled, (state: any, action) => {
      const {
        oldname,
        newname,
        workspace_index,
        card_index,
        workspace_name,
        target,
      } = action.payload;
      const cardname = state.data[workspace_index][workspace_name][card_index];

      target == "card_title"
        ? (state.data[workspace_index][workspace_name][card_index] = {
            [newname]:
              state.data[workspace_index][workspace_name][card_index][oldname],
          })
        : (state.data[workspace_index][workspace_name][card_index][
            Object.keys(cardname)[0]
          ][cardname[Object.keys(cardname)[0]].length] = newname);
    });
    builder.addCase(addTaskDB.fulfilled, (state: any, action) => {
      const { workspace_index, workspace_name, card_index, card_name } =
        action.payload;

      state.data[workspace_index][workspace_name][card_index][card_name].splice(
        state.data[workspace_index][workspace_name][card_index][card_name]
          .length - 1,
        0,
        {
          "Sip A Coffee": [],
        }
      );
    });
    builder.addCase(removeTaskDB.fulfilled, (state: any, action) => {
      const {
        workspace_index,
        workspace_name,
        card_index,
        card_name,
        task_index,
      } = action.payload;

      state.data[workspace_index][workspace_name][card_index][card_name] =
        state.data[workspace_index][workspace_name][card_index][
          card_name
        ].filter((_task: any, index: number) => index !== task_index);
    });
  },
});

export const user_data_reducer = user_data_slice.reducer;
export const { sidepanelHandle, changeCurrentWorkspace } =
  user_data_slice.actions;
