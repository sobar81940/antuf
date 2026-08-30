"use client";

import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "./store";
import "react-toastify/dist/ReactToastify.css";

export default function ClientProvider({ children }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ToastContainer />
        {children}
      </Provider>
    </SessionProvider>
  );
}
