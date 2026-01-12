"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TransferPage() {
  const router = useRouter();

  const [toUsername, setToUsername] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (!toUsername || !amount || !description) {
      setMessage("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            toUsername,
            amount: Number(amount),
            description,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Transfer failed");
        setLoading(false);
        return;
      }

      setMessage("Transfer successful!");
      setToUsername("");
      setAmount("");
      setDescription("");
    } catch {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleTransfer}
        className="w-full max-w-sm border p-6 rounded space-y-4"
      >
        <h1 className="text-xl font-bold">Transfer Money</h1>

        <input
          type="text"
          placeholder="Receiver username"
          value={toUsername}
          onChange={(e) => setToUsername(e.target.value)}
          className="w-full border p-2"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2"
        >
          {loading ? "Sending..." : "Send Money"}
        </button>

        {message && <p className="text-sm">{message}</p>}
      </form>
    </main>
  );
}
