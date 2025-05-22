"use client";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Product from "../../components/Product";

export default function HomePage() {
  const [productsInfo, setProductsInfo] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProductsInfo(data.slice(0, 6)))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold">Welcome to Our Store</h1>
        <p className="text-gray-500 mt-2">Find the best products for you</p>
      </div>

      {/* Products Preview */}
      <div className="flex flex-wrap justify-center gap-6">
        {productsInfo.map((productInfo) => (
          <div
            key={productInfo._id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
          >
            <Product {...productInfo} />
          </div>
        ))}
      </div>
    </Layout>
  );
}
