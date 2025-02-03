"use client";

import { Button } from "@chakra-ui/react";

export default function RoadPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-black via-red-950 to-black text-white p-4">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
          Coming Soon
        </h1>

        <p className="text-xl md:text-2xl text-gray-300">
          A powerful new experience brought to you by Tutela
        </p>

        <p className="text-lg md:text-xl text-gray-400">
          We're crafting something extraordinary. Stay tuned for updates.
        </p>

        <Button
          variant="outline"
          className="mt-8 border-red-500 text-red-500 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          Follow us on Discord
        </Button>
      </div>
    </div>
  );
}
