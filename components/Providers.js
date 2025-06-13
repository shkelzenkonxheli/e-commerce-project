"use client";

import { SessionProvider } from "next-auth/react";
import { ProductContextProvider } from "./ProductContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ProductContextProvider>{children}</ProductContextProvider>
    </SessionProvider>
  );
}
