import { persistReducer } from "redux-persist";
import UserReducer from "./Slices/UserSlice";
import storage from "redux-persist/lib/storage";
import { persistStore } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage,
};
const persisted = persistReducer(persistConfig, UserReducer);

const Store = configureStore({
  reducer: {
    user: persisted,
  },
});

const persistor = persistStore(Store);
export { Store, persistor };
