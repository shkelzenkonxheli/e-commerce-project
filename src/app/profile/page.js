"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading")
    return <p className="text-center mt-8">Loading...</p>;

  if (status === "unauthenticated") {
    redirect("/login");
    return null; // për siguri në rendering
  }

  const user = session?.user;

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Your Profile
      </h2>

      <form className="max-w-md w-full mx-auto bg-white shadow-lg rounded-2xl p-10 space-y-6 border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <div className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100">
            {user?.name || "Not provided"}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <div className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100">
            {user?.email}
          </div>
        </div>
      </form>
    </div>
  );
}
