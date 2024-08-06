import { configureStore } from "@reduxjs/toolkit";
import { user_data_reducer } from "./Slicers/slice";

export const store: any = configureStore({ reducer: { user_data_reducer } });

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch