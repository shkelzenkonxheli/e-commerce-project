import { useContext } from "react";
import { ProductContext } from "./ProductContext";
import { useEffect } from "react";

export default function Product({ _id, name, description, price, picture }) {
  const { selectedProduct, setSelectedProduct } = useContext(ProductContext);

  useEffect(() => {
    const savedProducts =
      JSON.parse(localStorage.getItem("selectedProducts")) || [];
    setSelectedProduct(savedProducts);
  }, []);

  function addProduct() {
    setSelectedProduct((prev) => {
      const updatedProducts = [...prev, _id];
      localStorage.setItem("selectedProducts", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  }

  return (
    <div className="w-full sm:w-64 max-w-xs mx-auto">
      <div className="bg-blue-100 p-5 rounded-xl">
        <img
          src={picture}
          alt={name}
          className="w-full h-40 object-contain mx-auto"
        />
      </div>
      <div className="mt-2">
        <h3 className="font-bold text-lg">{name}</h3>
      </div>
      <p className="text-sm mt-1">{description}</p>
      <div className="flex items-center mt-1">
        <div className="font-bold text-2xl grow">${price}</div>
        <button
          onClick={addProduct}
          className="bg-emerald-400 text-white py-1 px-4 rounded-xl"
        >
          +
        </button>
      </div>
    </div>
  );
}
