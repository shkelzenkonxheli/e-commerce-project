"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { resolve } from "path";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import UserTabs from "../../../components/UserTabs";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUsername(session.user.name || ""); // fallback në ""
      fetch("/api/profile").then((response) => {
        response.json().then((data) => {
          setPhone(data?.phone || "");
          setAddress(data?.address || "");
          setPostalCode(data?.postalCode || "");
          setCity(data?.city || "");
          setCountry(data?.country || "");
          setIsAdmin(data?.admin || false);
          setProfileFetched(true);
        });
      });
    }
  }, [session, status]);

  if (status === "loading" || !profileFetched)
    return <p className="text-center mt-8">Loading...</p>;
  if (status === "unauthenticated") {
    redirect("/login");
    return null;
  }

  const user = session?.user;

  async function handleSubmit(e) {
    e.preventDefault();
    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username,
          phone,
          address,
          postalCode,
          city,
          country,
        }),
      });
      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    toast.promise(savingPromise, {
      loading: "Saving",
      success: "Profile Saved",
      error: "Error",
    });
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <UserTabs isAdmin={isAdmin} />

      <form
        onSubmit={handleSubmit}
        className=" mt-8 max-w-md mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-4 border border-gray-100"
      >
        <div className="space-y-1">
          <label className="label-style">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="input-style"
          />
        </div>

        <div className="space-y-1">
          <label className="label-style">Email</label>
          <div className="readonly-style">{user?.email}</div>
        </div>

        <div className="space-y-1">
          <label className="label-style">Phone number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="input-style"
          />
        </div>

        <div className="space-y-1">
          <label className="label-style">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            className="input-style"
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2 space-y-1">
            <label className="label-style">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="input-style"
            />
          </div>
          <div className="w-1/2 space-y-1">
            <label className="label-style">Postal Code</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Postal Code"
              className="input-style"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="label-style">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter your country"
            className="input-style"
          />
        </div>

        <button type="submit" className="btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
}
