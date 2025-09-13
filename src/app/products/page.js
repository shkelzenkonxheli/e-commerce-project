"use client";
import { useEffect, useState } from "react";
import UserTabs from "../../../components/UserTabs";
import ProductForm from "../../../components/ProductForm";
import { toast } from "react-hot-toast";

export default function MenuItemsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkedAdmin, setCheckedAdmin] = useState(false);
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Fetch products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Fetch profile
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setIsAdmin(data.admin);
        setCheckedAdmin(true);
      });
  }, []);

  if (!checkedAdmin) return <p className="text-center mt-8">Loading...</p>;
  if (!isAdmin) return <p className="text-center mt-8">Not an admin</p>;

  const filteredItems = items
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) =>
      categoryFilter ? item.category === categoryFilter : true
    );

  function handleNewProduct(newProduct) {
    setItems((prevItems) => [...prevItems, newProduct]);
    setShowForm(false);
    toast.success("Product added successfully!");
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
    toast.success("Product updated!");
  }

  async function handleDeleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
        toast.success("Product deleted!");
      } else {
        toast.error("Failed to delete product");
      }
    }
  }

  return (
    <section className="mt-8 w-full mx-auto px-4 sm:px-6 bg-gray-50 min-h-screen">
      <UserTabs isAdmin={true} />

      {/* Toolbar */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          onClick={() => {
            setEditProduct(null);
            setShowForm((prev) => !prev);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700 transition-colors"
        >
          {showForm ? "Back" : "Add New Product"}
        </button>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 border rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-56 border rounded-xl px-3 py-2 shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Categories</option>
            {Array.from(new Set(items.map((item) => item.category))).map(
              (category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-start pt-20 z-50 overflow-auto">
          <div className="bg-gray-50 p-6 rounded-2xl shadow-lg w-full max-w-lg mx-4 my-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <div className="max-h-[80vh] overflow-y-auto">
              <ProductForm
                product={editProduct}
                onSave={editProduct ? handleUpdate : handleNewProduct}
              />
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {items.length === 0 ? (
        <p className="text-gray-500 mt-6">No products found.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="group bg-white border border-gray-100 rounded-2xl p-3 text-sm shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative rounded-xl bg-gray-50 p-2 flex items-center justify-center overflow-hidden">
                <img
                  src={item.picture}
                  alt={item.name}
                  className="h-24 w-full object-contain transition-transform group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-2">
                <h3
                  className="font-medium text-gray-800 truncate"
                  title={item.name}
                >
                  {item.name}
                </h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2 min-h-[32px]">
                  {item.description}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-semibold text-emerald-600 text-sm">
                    ${item.price}
                  </span>
                  <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-gray-100">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    item.stock < 5
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.stock} in stock
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditProduct(item)}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <img
                      src="/edit.png"
                      alt="Edit"
                      className="inline-block w-5 h-5"
                    />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(item._id)}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <img
                      src="/delete.png"
                      alt="Delete"
                      className="inline-block w-5 h-5"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
