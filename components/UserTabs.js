"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function UserTabs({ isAdmin }) {
  const path = usePathname();
  console.log(path);
  return (
    <div className="flex justify-center gap-2 tabs">
      <Link href="/profile" className={path === "/profile" ? "active" : ""}>
        Profile
      </Link>
      {isAdmin && (
        <>
          <Link
            href="/categories"
            className={path === "/categories" ? "active" : ""}
          >
            Categories
          </Link>
          <Link
            href="/products"
            className={path === "/products" ? "active" : ""}
          >
            Products
          </Link>
          <Link href="/users" className={path === "/users" ? "active" : ""}>
            Users
          </Link>
        </>
      )}
      <Link href="/orders" className={path === "/orders" ? "active" : ""}>
        Orders
      </Link>
    </div>
  );
}
