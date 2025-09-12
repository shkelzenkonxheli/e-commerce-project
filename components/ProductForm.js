import { useEffect, useState } from "react";

export default function ProductForm({ product, onSave }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [picture, setPicture] = useState("");
  const [stock, setStock] = useState("");

  async function handleFileChange(ev) {
    const file = ev.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // Name="file" është i rëndësishëm

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setPicture(data.url);
        console.log("Upload successful:", data.url); // përdor data.url jo picture
      } else {
        console.error("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const res = await fetch("/api/products", {
      method: product ? "PUT" : "POST",
      body: JSON.stringify({
        id: product?._id,
        name,
        description,
        price,
        category,
        picture,
        stock,
      }),
      headers: { "Content-type": "application/json" },
    });

    if (res.ok) {
      const savedProduct = await res.json();
      onSave(savedProduct);
      // reset
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setPicture("");
      setStock("");
    }
  }

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setCategory(product.category || "");
      setPicture(product.picture || "");
      setStock(product.stock || "");
    }
  }, [product]);

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 max-w-md mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-4 border border-gray-100"
    >
      <h2 className="flex justify-center text-2xl font-bold text-gray-800">
        {product ? "Edit Product" : "Add Product"}
      </h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="input-style"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="input-style"
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        type="number"
        className="input-style"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="input-style"
      >
        <option value="">Select a category</option>
        <option value="mobiles">Mobiles</option>
        <option value="audio">Audio</option>
        <option value="laptops">Laptops</option>
      </select>
      <input
        type="file"
        name="file"
        accept="image/*"
        onChange={handleFileChange}
        className="input-style"
      />

      {picture && (
        <div className="mt-2">
          <img
            src={picture}
            alt="Preview"
            className="h-32 object-cover rounded"
          />
        </div>
      )}

      <input
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Stock"
        type="number"
        className="input-style"
      />
      <button type="submit" className="btn-primary">
        Save Product
      </button>
    </form>
  );
}
