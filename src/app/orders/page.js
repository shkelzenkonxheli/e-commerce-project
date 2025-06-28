"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UserTabs from "../../../components/UserTabs";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  const [orders, setOrders] = useState([]);

  // Marrim të dhënat e profilit
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

  // Marrim porositë vetëm kur profili është marrë
  useEffect(() => {
    if (status === "authenticated" && profileFetched) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [session, status, profileFetched]);

  // Shfaq ngarkimin vetëm pasi të jenë marrë të dhënat
  if (status === "loading" || !profileFetched) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <UserTabs isAdmin={isAdmin} />
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul className="mt-8 flex flex-jusitfy-between flex-col gap-4">
            {orders.map((order) => (
              <li
                key={order._id}
                className="border-b border-gray-200 py-4 flex justify-between"
              >
                {order.address},{order.name},
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                {order.city},
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
