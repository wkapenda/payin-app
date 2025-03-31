"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";
import { LoadingProvider } from "@/context/LoadingContext";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: Readonly<ProvidersProps>) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LoadingProvider>{children}</LoadingProvider>
      </PersistGate>
    </Provider>
  );
}
