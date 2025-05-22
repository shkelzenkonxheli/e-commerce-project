"use client";
import { ProductContextProvider } from "./ProductContext";

export default function Providers({ children }) {
  return <ProductContextProvider>{children}</ProductContextProvider>;
}
