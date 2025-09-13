import { useState } from "react";

export default function UserForm({ onSave }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  function handleFormSubmit(ev) {
    ev.preventDefault();
    fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ name, email, password, isAdmin }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => onSave(data));
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-4 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
    >
      <h2 className="text-lg font-semibold text-gray-800">Create New User</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-600">Name</label>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-600">Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-600">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isAdmin"
          checked={isAdmin}
          onChange={(ev) => setIsAdmin(ev.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="isAdmin" className="text-sm text-gray-700">
          Grant Admin Rights
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-500 text-gray-100 py-2 px-4 rounded-lg shadow hover:bg-emerald-600 transition-colors cursor-pointer"
      >
        Save User
      </button>
    </form>
  );
}
