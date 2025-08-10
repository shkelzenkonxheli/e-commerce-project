"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useContext } from "react";
import { ProductContext } from "./ProductContext";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const session = useSession();
  console.log(session);
  const status = session.status;
  const user = session.data?.user;
  let userName = user?.name || useSession?.email;

  if (!user?.name && user?.email) {
    userName = user?.email.split("@")[0];
  } else {
    userName = user?.name.split(" ")[0];
  }

  const pathname = usePathname();
  const { selectedProduct } = useContext(ProductContext);

  return (
    <header className="bg-white shadow-md px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link className="text-emerald-400 font-bold text-2xl" href="/">
          My Store
        </Link>

        {/* Hamburger Icon for Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-600 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Navigation for Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-gray-700 text-sm font-medium">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/shop" className="hover:underline">
            Shop
          </Link>

          {pathname === "/shop" && (
            <Link href="/checkout" className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              {selectedProduct.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-sky-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedProduct.length}
                </span>
              )}
            </Link>
          )}

          {status === "authenticated" ? (
            <>
              <Link href="/profile" className="hover:underline">
                Hello, {userName}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-emerald-400 rounded-full text-white px-4 py-1 hover:bg-emerald-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-emerald-400 rounded-full text-white px-4 py-1 hover:bg-emerald-500"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Dropdown Menu for Mobile */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 text-gray-700 text-sm font-medium px-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/shop" className="hover:underline">
            Shop
          </Link>

          {pathname === "/shop" && (
            <Link href="/checkout" className="relative">
              <div className="flex items-center gap-2">
                <span>Cart</span>
                {selectedProduct.length > 0 && (
                  <span className="bg-sky-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedProduct.length}
                  </span>
                )}
              </div>
            </Link>
          )}

          {status === "authenticated" ? (
            <>
              <Link href="/profile" className="hover:underline">
                Hello, {userName}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-emerald-400 rounded-full text-white px-4 py-1 hover:bg-emerald-500 w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-emerald-400 rounded-full text-white px-4 py-1 hover:bg-emerald-500 w-full text-center"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
