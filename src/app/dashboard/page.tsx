"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type WalletResponse = {
  balance: number;
  currency: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [balance, setBalance] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const verifyPaystackPayment = async (reference: string) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/fund/paystack/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reference }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Payment verification failed");
        return;
      }

      setBalance(data.balance);
      setCurrency("NGN");
      setMessage("Wallet funded successfully");
    } catch {
      setMessage("Unable to verify payment");
    }
  };

  const fetchWalletBalance = async (token: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/balance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setBalance(data.balance);
      setCurrency(data.currency);
    } catch {
      setMessage("Failed to fetch wallet balance");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference");

    console.log("Paystack reference from the URL is:", reference);

    if (reference) {
      // defer verification to avoid calling setState synchronously within the effect
      setTimeout(() => {
        verifyPaystackPayment(reference);
        window.history.replaceState({}, "", "/dashboard");
      }, 0);
    } else {
      // defer fetching the wallet balance so setState is not called synchronously within the effect
      setTimeout(() => {
        fetchWalletBalance(token);
      }, 0);
    }
  }, [router]);

  const handleFundWallet = async () => {
    const token = localStorage.getItem("token");

    if (!token || !amount) {
      setMessage("Enter an amount");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/fund/paystack`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Number(amount),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Unable to initialize payment");
        setLoading(false);
        return;
      }

      // to redirect to Paystack
      window.location.href = data.authorization_url;
    } catch (error) {
      setMessage("Payment initialization failed");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Wallet Dashboard</h1>

      {message && <p>{message}</p>}

      {balance !== null ? (
        <div className="border p-4 rounded max-w-sm">
          <p className="text-lg">Balance</p>
          <p className="text-2xl font-bold">
            {currency} {balance}
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <div className="mt-6 border p-4 rounded max-w-sm space-y-3">
        <h2 className="font-bold">Fund Wallet</h2>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2"
          aria-label="Amount to fund"
        />

        <div className="flex gap-3">
          <button
            onClick={handleFundWallet}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded"
            aria-label="Fund wallet"
          >
            {loading ? "Redirecting..." : "Fund Wallet"}
          </button>

          <button
            onClick={() => router.push("/transfer")}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded border"
            aria-label="Go to transfer page"
          >
            Transfer
          </button>
        </div>
      </div>
    </main>
  );
}
