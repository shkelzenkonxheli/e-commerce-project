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

  const filteredItems = items
    .filter((item) => {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter((item) => {
      return categoryFilter ? item.category === categoryFilter : true;
    });

  return (
    <section className="mt-8 max-w-7xl mx-auto px-4 sm:px-6">
      <UserTabs isAdmin={true} />

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => {
            setEditProduct(null);
            setShowForm((prev) => !prev);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 mb-0 px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700"
        >
          {showForm ? "Back" : "Add New Item"}
        </button>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
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
            className="w-full sm:w-56 border rounded-xl px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

      {/* Form */}
      {showForm && (
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
          <ProductForm
            product={editProduct}
            onSave={editProduct ? handleUpdate : handleNewProduct}
          />
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
                  <span className="text-xs text-gray-500 truncate max-w-[80px] text-right">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">
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
