"use client";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import Product from "../../../components/Product";
import { useRouter } from "next/navigation";

export default function ShopPage() {
  const [productsInfo, setProductsInfo] = useState([]);
  const [phrase, setPhrase] = useState("");
  const [sortBy, setSortBy] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProductsInfo(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const categoriesName = [...new Set(productsInfo.map((p) => p.category))];

  let products;
  if (phrase) {
    products = productsInfo.filter((p) =>
      p.name.toLowerCase().includes(phrase.toLowerCase())
    );
  } else {
    products = productsInfo;
  }
  if (sortBy === "priceLowToHigh") {
    products.sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceHighToLow") {
    products.sort((a, b) => b.price - a.price);
  }

  return (
    <Layout>
      {/* Search Bar */}
      <div className="flex justify-center py-8">
        <input
          type="text"
          placeholder="Search for products"
          className="bg-gray-100 w-1/2 sm:w-1/3 lg:w-1/4 px-4 py-2 rounded-xl border border-gray-300"
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-100 px-4 py-2 rounded-xl border border-gray-300 ml-4"
        >
          <option value="">Sort By</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
        </select>
      </div>

      {/* Product Categories and Display */}
      <div className="py-6">
        {categoriesName.map((categoryName) => (
          <div key={categoryName}>
            {products.find((p) => p.category === categoryName) && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold capitalize text-center py-4">
                  {categoryName}
                </h2>
                <div className="flex flex-wrap justify-center gap-6">
                  {products
                    .filter((p) => p.category === categoryName)
                    .map((productInfo) => (
                      <div
                        key={productInfo._id}
                        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                      >
                        <Product {...productInfo} />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}
