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
            href="/menu-items"
            className={path === "/menu-items" ? "active" : ""}
          >
            Menu Items
          </Link>
          <Link href="/users" className={path === "/users" ? "active" : ""}>
            Users
          </Link>
        </>
      )}
    </div>
  );
}
