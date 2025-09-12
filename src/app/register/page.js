"use client";
import { useState } from "react";
import Image from "next/image";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatingUser(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setUserCreated(true);
        setEmail("");
        setPassword("");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setCreatingUser(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full mx-auto mt-16 bg-white rounded-2xl p-10 space-y-6"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Create Account
      </h2>

      <div className="flex">
        <MdOutlineMail className="mr-3 mt-2 w-10 h-10 text-gray-400" />
        <input
          placeholder="Email address"
          type="email"
          value={email}
          disabled={creatingUser}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex">
        <RiLockPasswordLine className="mr-3 mt-2 w-10 h-10 text-gray-400" />
        <input
          placeholder="Password"
          type="password"
          value={password}
          disabled={creatingUser}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <button
        type="submit"
        disabled={creatingUser}
        className="w-full cursor-pointer bg-emerald-400 hover:bg-emerald-500 text-white py-2 rounded-full font-semibold transition duration-200 disabled:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {creatingUser ? "Creating..." : "Register"}
      </button>
      <button className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white border border-gray-300 py-2 rounded-full font-semibold text-gray-700 hover:bg-gray-100 transition">
        <Image src="/google.png" width={24} height={24} alt="Google" />
        Login with Google
      </button>
      {userCreated && (
        <p className="text-center text-green-600 font-medium">
          Account created successfully!
        </p>
      )}

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-emerald-600 hover:underline font-medium cursor-pointer"
        >
          Log in
        </a>
      </p>
    </form>
  );
}
