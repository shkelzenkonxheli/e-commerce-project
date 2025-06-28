"use client";
import { useEffect, useState } from "react";
import UserTabs from "../../../components/UserTabs";
import ProductForm from "../../../components/ProductForm";

export default function MenuItemsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkedAdmin, setCheckedAdmin] = useState(false);
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);
  function handleNewProduct(newProduct) {
    setItems((prevItems) => [...prevItems, newProduct]);
    setShowForm(false);
  }
  function handleEditProduct(item) {
    setEditProduct(item);
    setShowForm(true);
  }
  function handleUpdate(updated) {
    setItems((prev) =>
      prev.map((item) => (item._id === updated._id ? updated : item))
    );
    setEditProduct(null);
    setShowForm(false);
  }
  async function handleDeleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
      const res = await fetch("api/products", {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
      } else {
        console.error("Failed to delete product");
      }
    }
  }
  useEffect(() => {
    fetch("api/profile").then((res) => {
      res.json().then((data) => {
        setIsAdmin(data.admin);
        setCheckedAdmin(true);
      });
    });
  }, []);
  if (!checkedAdmin) return <p className="text-center mt-8">Loading...</p>;
  if (!isAdmin) return <p className="text-center mt-8">Not an admin</p>;

  return (
    <section className="mt-8 max-w-6xl mx-auto px-4">
      <UserTabs isAdmin={true} />

      <button
        onClick={() => {
          setEditProduct(null);
          setShowForm((prev) => !prev);
        }}
        className="mb-4 px-4 py-2 bg-emerald-500 text-white font-bold cursor-pointer rounded-lg"
      >
        {showForm ? "Back" : "Add New Item"}
      </button>
      {showForm && (
        <ProductForm
          product={editProduct}
          onSave={editProduct ? handleUpdate : handleNewProduct}
        />
      )}
      <h1 className="text-xl font-semibold mb-4">Menu Items</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow rounded-lg p-3 text-sm"
            >
              <div className="bg-blue-100 p-2 rounded-md">
                <img
                  src={item.picture}
                  alt={item.name}
                  className="h-24 w-full object-contain mx-auto"
                />
              </div>
              <div className="mt-2">
                <h3 className="font-medium text-gray-800 truncate">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-green-600 text-sm">
                    ${item.price}
                  </span>
                  <span className="text-xs text-gray-500">{item.category}</span>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <button onClick={() => handleEditProduct(item)}>
                  <img
                    src="/edit.png"
                    alt="Edit"
                    className="inline-block w-6 h-6 mr-1 *:hover:opacity-75 cursor-pointer"
                  />
                </button>
                <button onClick={() => handleDeleteProduct(item._id)}>
                  <img
                    src="/delete.png"
                    alt="Delete"
                    className="inline-block w-6 h-6 mr-1 *:hover:opacity-75 cursor-pointer"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
