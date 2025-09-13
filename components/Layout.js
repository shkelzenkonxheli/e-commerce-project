"use client";
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  const pathName = usePathname();
  return <div className="p-5 bg-[#f9fafb]">{children}</div>;
}
