"use client";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  return (
    <div className="container text-center">
      <h1 className="text-2xl font-bold">Payment Successful</h1>
      <p className="mt-4">Thank you for your purchase</p>
      <button
        onClick={goHome}
        className="mt-5 px-6 py-2 bg-emerald-500 text-white font-bold rounded-lg"
      >
        Go Home
      </button>
    </div>
  );
}
