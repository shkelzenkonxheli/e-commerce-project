import { createContext, useState } from "react";

export const ProductContext = createContext();

export function ProductContextProvider({ children }) {
  const [selectedProduct, setSelectedProduct] = useState([]);

  return (
    <ProductContext.Provider value={{ selectedProduct, setSelectedProduct }}>
      {children}
    </ProductContext.Provider>
  );
}
