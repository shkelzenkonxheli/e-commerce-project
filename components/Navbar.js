"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useContext } from "react";
import { ProductContext } from "./ProductContext";

const Navbar = () => {
  const pathname = usePathname();
  const { selectedProduct } = useContext(ProductContext);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <Link className="text-emerald-400 font-semibold text-2xl" href="/">
        My Store
      </Link>

      <nav className="flex items-center gap-6 text-gray-500">
        <Link href="/" className="text-gray-700 hover:underline">
          Home
        </Link>
        <Link href="/about" className="text-gray-700 hover:underline">
          About
        </Link>
        <Link href="/contact" className="text-gray-700 hover:underline">
          Contact
        </Link>
        {pathname !== "/shop" && (
          <Link href="/checkout" className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {selectedProduct.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-sky-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {selectedProduct.length}
              </span>
            )}
          </Link>
        )}
      </nav>

      <nav className="flex items-center gap-4 text-gray-500 font-semibold">
        <Link href={"/login"} className="hover:underline">
          Login
        </Link>
        <Link
          href={"/register"}
          className="bg-emerald-400 rounded-full text-white px-6 py-2 hover:bg-primary/80"
        >
          Register
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
{
  /* Shop Now button only if not on /shop */
}
{
  /*pathname !== "/shop" && (
            <Link
              href="/shop"
              className="bg-emerald-700 cursor-pointer text-white px-6 py-2 rounded-xl font-bold"
            >
              Shop Now
            </Link>
          )*/
}
