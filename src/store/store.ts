import { configureStore } from "@reduxjs/toolkit";
import currencyReducer from "./currencySlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

const persistConfig = {
  key: "currency",
  storage: storageSession,
  //   whitelist: ["currency"],
};

const persistedCurrencyReducer = persistReducer(persistConfig, currencyReducer);

export const store = configureStore({
  reducer: {
    currency: persistedCurrencyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
