"use client";
import UserTabs from "../../../components/UserTabs";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [checkedAdmin, setCheckedAdmin] = useState(false);

  useEffect(() => {
    fetch("api/products").then((res) => {
      res
        .json()
        .then((products) => {
          const categorySet = new Set(
            products.map((p) => p.category).filter(Boolean)
          );
          setCategories(Array.from(categorySet));
        })
        .catch((err) => console.error("Error fetching products:", err));
    });
  }, []);

  useEffect(() => {
    fetch("api/profile").then((res) => {
      res.json().then((data) => {
        setIsAdmin(data.admin);
        setCheckedAdmin(true);
      });
    });
  }, []);
  if (!checkedAdmin) return <p className="text-center mt-8">Loading...</p>;

  if (!isAdmin) return <p className="text-center mt-8">Not authorized</p>;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setCategories((prev) => [...new Set([...prev, newCategory.trim()])]);
    setNewCategory("");
  };

  return (
    <section className="mt-8 max-w-2xl mx-auto px-4">
      <UserTabs isAdmin={true} />

      <form onSubmit={handleSubmit} className="mb-6 mt-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Add New Category
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter category name"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm">No categories found.</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat, i) => (
              <li
                key={i}
                className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-md text-sm"
              >
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
