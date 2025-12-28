"use client";

import { useEffect } from "react";

export default function GlobalError({ error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  
  return <>
    <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-semibold mb-4">Something went wrong 😔</h2>
      </div>
  
  </>
    
  
}
