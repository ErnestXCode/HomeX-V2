import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/users/userSlice";
import styleSlice from "../features/stylings/styleSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducer = combineReducers({ user: userSlice, customStyles: styleSlice });

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
});

export default store;
