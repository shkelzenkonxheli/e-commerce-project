"use client";
import { useEffect, useState } from "react";
import UserTabs from "../../../components/UserTabs";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => setIsAdmin(data.admin))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  function handleChangeAdminStatus(userId, currentStatus) {
    return () => {
      const confirmMessage = currentStatus
        ? "Are you sure you want to revoke admin rights for this user?"
        : "Are you sure you want to grant admin rights to this user?";
      if (!confirm(confirmMessage)) return;
      fetch(`/api/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, admin: !currentStatus }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to update user");
          return res.json();
        })
        .then((data) => {
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user._id === userId ? data : user))
          );
        })
        .catch((err) => setError(err.message));
    };
  }
  function handleDeleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    fetch(`/api/users`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete user");
        return res.json();
      })
      .then((data) => {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
      })
      .catch((err) => setError(err.message));
  }

  const filteredUsers = users
    .filter((user) => {
      if (searchTerm) {
        return (
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    })
    .filter((user) => {
      if (categoryFilter) {
        if (categoryFilter === "admin") return user.admin;
        if (categoryFilter === "buyer") return !user.admin;
      }
      return true;
    });

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-4">
      <div className="mb-6 w-full max-w-5xl">
        <UserTabs isAdmin={isAdmin} />
      </div>
      <section className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h1 className="text-xl font-semibold tracking-tight text-gray-800">
            Users
          </h1>
        </header>
        <div className="p-6 flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between mb-4">
          <input
            type="text"
            placeholder="Search by name or email"
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="flex w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="admin">Admin</option>
            <option value="buyer">Buyer</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {loading && (
            <p className="p-6 text-center text-sm text-gray-500">
              Loading users...
            </p>
          )}
          {error && (
            <p className="p-6 text-center text-sm text-red-500">
              Error: {error}
            </p>
          )}
          {!loading && !error && (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-6 py-3 font-medium text-gray-600">
                    User ID
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-600">
                    Name &amp; Email
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-600">Phone</th>
                  <th className="px-6 py-3 font-medium text-gray-600">City</th>
                  <th className="px-6 py-3 font-medium text-gray-600">
                    Created At
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-600 text-right">
                    Admin
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-600 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-3 font-medium text-gray-700">
                      #{user._id.slice(-6)}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 truncate max-w-[220px] sm:max-w-none">
                          {user.name}
                        </span>
                        <span className="text-xs text-gray-500 truncate max-w-[220px] sm:max-w-none">
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {user.phone || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {user.city || "—"}
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span
                        onClick={handleChangeAdminStatus(user._id, user.admin)}
                        className={` cursor-pointer inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                          user.admin
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.admin ? "✔ Yes" : "✖ No"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                      >
                        <img
                          src="/delete.png"
                          alt="Delete"
                          className="inline-block w-5 h-5"
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
