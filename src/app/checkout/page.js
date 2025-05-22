"use client";
import { useContext, useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { ProductContext } from "../../../components/ProductContext";

export default function CheckoutPage() {
  const { selectedProduct, setSelectedProduct } = useContext(ProductContext);
  const [productsInfo, setProductsInfo] = useState([]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const savedProducts =
      JSON.parse(localStorage.getItem("selectedProducts")) || [];
    setSelectedProduct(savedProducts);
  }, []);

  useEffect(() => {
    if (!selectedProduct || selectedProduct.length === 0) return;

    const uniqIds = [...new Set(selectedProduct)];
    fetch(`/api/products?ids=${uniqIds.join(",")}`)
      .then((response) =>
        response.ok ? response.json() : Promise.reject("Fetching error")
      )
      .then((json) => setProductsInfo(json))
      .catch((error) => console.error(error));
  }, [selectedProduct]);

  function moreOfThisProduct(_id) {
    setSelectedProduct((prev) => {
      const updatedProducts = [...prev, _id];
      localStorage.setItem("selectedProducts", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  }

  function lessOfThisProduct(_id) {
    setSelectedProduct((prev) => {
      const updatedProducts = prev.filter((id) => id !== _id);
      localStorage.setItem("selectedProducts", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  }

  const deliveryPrice = 5;
  let subTotal = 0;
  if (selectedProduct?.length) {
    for (let id of selectedProduct) {
      const productItem = productsInfo.find((p) => p._id === id);
      if (productItem) {
        subTotal += productItem.price;
      }
    }
  }

  const total = subTotal + deliveryPrice;

  function handleCheckout() {
    if (!name || !email || !address || !city) {
      alert("Ju lutem plotesoni te gjitha te dhenat e kerkura.");
      return;
    }

    fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        products: selectedProduct
          .map((id) => {
            const product = productsInfo.find((p) => p._id === id);
            return product
              ? { name: product.name, price: product.price, quantity: 1 }
              : null;
          })
          .filter((p) => p !== null),
        total,
        address,
        city,
        name,
        email,
        deliveryPrice,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id && data.url) {
          window.location.href = data.url;
        } else {
          console.error("Stripe session URL is missing:", data);
        }
      });
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
          {productsInfo.length > 0 ? (
            <ul className="space-y-4">
              {productsInfo.map((product) => (
                <div
                  key={product._id}
                  className="flex bg-white p-4 rounded-lg shadow-lg"
                >
                  <img
                    className="w-24 h-24 object-cover rounded-lg"
                    src={product.picture}
                    alt={product.name}
                  />
                  <div className="ml-4 flex flex-col justify-between">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-lg font-bold">${product.price}</div>
                      <div className="flex items-center">
                        <button
                          onClick={() => lessOfThisProduct(product._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-full"
                        >
                          -
                        </button>
                        <span className="mx-2">
                          {
                            selectedProduct.filter((id) => id === product._id)
                              .length
                          }
                        </span>
                        <button
                          onClick={() => moreOfThisProduct(product._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded-full"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              Empty cart. Please add some products.
            </p>
          )}
          {selectedProduct.length > 0 && (
            <>
              <div className="mt-6">
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md mb-3"
                  type="text"
                  placeholder="Street Address"
                />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md mb-3"
                  type="text"
                  placeholder="City and Postal Code"
                />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md mb-3"
                  type="text"
                  placeholder="Your Name"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md mb-3"
                  type="email"
                  placeholder="Email Address"
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold text-gray-700">SubTotal:</h3>
                  <h3 className="font-bold">${subTotal}</h3>
                </div>
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold text-gray-700">Delivery:</h3>
                  <h3 className="font-bold">
                    {selectedProduct.length > 0 ? deliveryPrice : 0}
                  </h3>
                </div>
                <div className="flex justify-between border-t pt-3 border-dashed border-gray-300 mb-6">
                  <h3 className="font-semibold text-gray-700">Total:</h3>
                  <h3 className="font-bold text-green-500">${total}</h3>
                </div>

                <button
                  onClick={handleCheckout}
                  className="bg-green-500 text-white px-6 py-3 rounded-xl w-full font-semibold"
                >
                  Pay ${total}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
