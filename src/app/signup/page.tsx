"use client";

import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            username,
            phone,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Signup failed");
        return;
      }

      setMessage("Signup successful. You can now log in.");
      setEmail("");
      setUsername("");
      setPhone("");
      setPassword("");
    } catch (error) {
      setMessage("Network error");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-slate-50 p-6">
      <div className="w-full max-w-md">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-indigo-600">
            PayG Wallet
          </h1>
          <p className="mt-1 text-sm text-gray-500">Secure. Fast. Simple.</p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white/95 shadow-md rounded-lg p-6 space-y-5 border border-gray-100"
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-700">
              Create an account
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Start your PayG Wallet journey — no fees to sign up.
            </p>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="your handle"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Choose a unique username visible to others.
            </p>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="+1 555 555 5555"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-md bg-linear-to-r from-indigo-600 to-purple-600 text-white py-2 font-semibold shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>

          {message && (
            <p className="text-sm text-center text-gray-600">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}
