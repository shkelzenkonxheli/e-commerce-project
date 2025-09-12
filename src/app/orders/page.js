"use client";
import { useEffect, useState } from "react";
import UserTabs from "../../../components/UserTabs";

export default function OrdersPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoadingOrders(false);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  async function handleDelete(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId }),
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        setActiveOrder(null);
      }
    }
  }

  useEffect(() => {
    fetch("api/profile")
      .then((res) => res.json())
      .then((data) => {
        setIsAdmin(data.admin);
      });
  }, []);
  const filteredOrders = orders
    .filter((order) => {
      if (categoryFilter === "paid") return order.paid === true;
      if (categoryFilter === "not-paid") return order.paid === false;
      return true;
    })
    .filter((order) => {
      if (searchTerm) {
        return (
          order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    })
    .filter((order) => {
      if (filterDate) {
        const now = new Date();
        const orderDate = new Date(order.createdAt);
        if (filterDate === "last-7-days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          return orderDate >= sevenDaysAgo;
        }
        if (filterDate === "last-30-days") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          return orderDate >= thirtyDaysAgo;
        }
        if (filterDate === "last-90-days") {
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(now.getDate() - 90);
          return orderDate >= ninetyDaysAgo;
        }
      }
      return true;
    });

  if (loadingOrders) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <UserTabs isAdmin={isAdmin} />
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div>
          <div className="flex items-center gap-4 mt-10">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="not-paid">Not Paid</option>
            </select>
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Dates</option>
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="last-90-days">Last 90 Days</option>
            </select>
          </div>
          <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-3">
            <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
              <header className="flex items-center justify-between px-4 sm:px-6 py-4">
                <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
                  Orders
                </h1>
                <span className="text-sm text-gray-500">
                  {filteredOrders.length} total
                </span>
              </header>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left bg-gray-50">
                      <th className="px-4 sm:px-6 py-3 font-medium text-gray-600">
                        Order ID
                      </th>
                      <th className="px-4 sm:px-6 py-3 font-medium text-gray-600">
                        Customer
                      </th>
                      <th className="px-4 sm:px-6 py-3 font-medium text-gray-600">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 font-medium text-gray-600 text-right">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id.slice(-5)}
                        className="cursor-pointer transition-colors hover:bg-gray-50"
                        onClick={() => setActiveOrder(order)}
                      >
                        <td className="px-4 sm:px-6 py-3 font-medium">
                          #{order._id.slice(-6)}
                        </td>
                        <td className="px-4 sm:px-6 py-3">
                          <div className="flex flex-col">
                            <span className="font-medium truncate max-w-[220px] sm:max-w-none">
                              {order.name}
                            </span>
                            <span className="text-xs text-gray-500 truncate max-w-[220px] sm:max-w-none">
                              {order.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3">
                          <span
                            className={
                              (order.paid
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700") +
                              " inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                            }
                          >
                            <span
                              className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                              style={{
                                backgroundColor: order.paid
                                  ? "#16a34a"
                                  : "#b91c1c",
                              }}
                            />
                            {order.paid ? "Paid" : "Not Paid"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-right font-semibold">
                          ${order.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Order Details */}
            <aside className="lg:sticky lg:top-6 h-fit bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              {activeOrder ? (
                <div>
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">
                        Order #{activeOrder._id.slice(-6)}
                      </h2>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {activeOrder?.createdAt
                          ? new Date(activeOrder.createdAt).toLocaleString()
                          : null}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={
                          (activeOrder && activeOrder.paid
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700") +
                          " inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                        }
                      >
                        <span
                          className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              activeOrder && activeOrder.paid
                                ? "#16a34a"
                                : "#b91c1c",
                          }}
                        />
                        {activeOrder && activeOrder.paid ? "Paid" : "Not Paid"}
                      </span>
                      <button
                        onClick={() => setActiveOrder(null)}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        aria-label="Close details"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-4 rounded-xl bg-gray-50 p-3">
                    <p className="font-medium">{activeOrder.name}</p>
                    <p className="text-sm text-gray-600">{activeOrder.email}</p>
                  </div>

                  {/* Products */}
                  <div className="space-y-3">
                    {activeOrder.products.map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.picture}
                            alt={p.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-gray-500 ">
                              Qty: {p.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">${p.price}</p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="font-semibold">${activeOrder.total}</span>
                  </div>

                  <div className="mt-4 flex justify-end">
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(activeOrder._id)}
                        className="px-3 py-2 text-sm rounded-xl border bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                      >
                        Delete order
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Select an order to view details</p>
              )}
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
