"use client";

import { useState } from "react";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      // store token
      localStorage.setItem("token", data.token);

      setMessage("Login successful");
      setIdentifier("");
      setPassword("");
    } catch (error) {
      setMessage("Network error");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 border rounded space-y-4"
      >
        <h1 className="text-xl font-bold">Login</h1>

        <input
          type="text"
          placeholder="Email, username or phone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full border p-2"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2"
          required
        />

        <button type="submit" className="w-full bg-black text-white py-2">
          Login
        </button>

        {message && <p className="text-sm">{message}</p>}
      </form>
    </main>
  );
}
