"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/`)
      .then((res) => res.json())
      .then((data: { message: string }) => {
        setMessage(data.message);
      })
      .catch(() => {
        setMessage("Backend not reachable");
      });
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">PayG Frontend</h1>
      <p>{message}</p>
    </main>
  );
}
