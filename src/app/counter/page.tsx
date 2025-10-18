"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CounterPage() {
  const { data: session } = useSession();
  console.log(session?.user?.image);

  const [count, setCount] = useState(0);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">{count}</h1>
      <div className="flex space-x-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
        <button
          className="rounded bg-red-500 px-4 py-2 text-white"
          onClick={() => setCount(count - 1)}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
