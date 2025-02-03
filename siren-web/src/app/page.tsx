"use client";

import Welcome from "@/lib/Welcome";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="animate-pulse">
          <Image
            src="/siren-bot.png"
            alt="Siren Bot Logo"
            width={100}
            height={100}
            className="animate-bounce"
          />
        </div>
      </div>
    );
  }

  return <Welcome />;
}
