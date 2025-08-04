"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UserTabs from "../../../components/UserTabs";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetch("/api/profile")
        .then((response) => response.json())
        .then((data) => {
          setIsAdmin(data?.admin || false);
          setProfileFetched(true);
        });
    }
  }, [session, status]);

  useEffect(() => {
    if (status === "authenticated" && profileFetched) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [session, status, profileFetched]);

  async function handleDelete(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderId }),
      });
      if (res.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
      } else {
        console.error("Failed to delete order");
      }
    }
  }

  if (status === "loading" || !profileFetched) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <UserTabs isAdmin={isAdmin} />
      <h1 className="mt-8 text-2xl font-bold mb-4 text-center">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  border-gray-300 shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="px-4 py-3 ">Name</th>
                <th className="px-4 py-3 ">Address</th>
                <th className="px-4 py-3 ">Total</th>
                <th className="px-4 py-3 ">Date</th>
                <th className="px-4 py-3 ">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="text-sm text-gray-600 hover:bg-gray-50 "
                >
                  <td className="px-4 py-3">{order.name}</td>
                  <td className="px-4 py-3">
                    {order.address}, {order.city}
                  </td>
                  <td className="px-4 py-3">
                    ${order.total?.toFixed(2) ?? "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        order.paid
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                      }
                    >
                      {order.paid ? "Paid" : "Not Paid"}
                    </span>
                  </td>
                  <td onClick={() => handleDelete(order._id)}>
                    <img
                      src={"/delete.png"}
                      alt={"delete"}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
