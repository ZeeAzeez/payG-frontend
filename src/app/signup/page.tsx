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
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 border rounded space-y-4"
      >
        <h1 className="text-xl font-bold">Sign Up</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2"
          required
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2"
          required
        />

        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
          Sign Up
        </button>

        {message && <p className="text-sm">{message}</p>}
      </form>
    </main>
  );
}
