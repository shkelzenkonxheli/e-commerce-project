"use client";
import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginInProgres, setLoginInProgres] = useState(false);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setLoginInProgres(true);

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });

    setLoginInProgres(false);
  }

  return (
    <form
      className="max-w-md w-full mx-auto mt-16 bg-white shadow-lg rounded-2xl p-10 space-y-6 border border-gray-200"
      onSubmit={handleFormSubmit}
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          placeholder="Email address"
          type="email"
          name="email"
          value={email}
          disabled={loginInProgres}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          placeholder="Password"
          type="password"
          name="password"
          value={password}
          disabled={loginInProgres}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <button
        type="submit"
        disabled={loginInProgres}
        className="w-full bg-emerald-400 hover:bg-emerald-500 text-white py-2 rounded-full font-semibold transition duration-200 disabled:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        Login
      </button>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-2 rounded-full font-semibold text-gray-700 hover:bg-gray-100 transition"
      >
        <Image src="/google.png" width={24} height={24} alt="Google" />
        Login with Google
      </button>
    </form>
  );
}
