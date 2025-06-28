import { useEffect, useState } from "react";
export default function ProductForm({ product, onSave }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [picture, setPicture] = useState("");

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
      }),
      headers: { "Content-type": "application/json" },
    });

    if (res.ok) {
      const savedProduct = await res.json();
      onSave(savedProduct);
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setPicture("");
    }
  }
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setCategory(product.category || "");
      setPicture(product.picture || "");
    }
  }, [product]);

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 max-w-md mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-4 border border-gray-100"
    >
      <h2 className=" flex justify-center text-2xl font-bold text-gray-800">
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
      <div className="space-y-2">
        <select
          name="selectCategory"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-style"
        >
          <option value="">Select a category</option>
          <option value="mobiles">Mobiles</option>
          <option value="audio">Audio</option>
          <option value="laptops">Laptops</option>
        </select>
      </div>
      <input
        value={picture}
        onChange={(e) => setPicture(e.target.value)}
        placeholder="Image URL"
        className="input-style"
      />
      <button type="submit" className="btn-primary">
        Save Product
      </button>
    </form>
  );
}
