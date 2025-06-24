"use client";

import { useEffect } from "react";

function UserValid({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Immediate check on mount
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      window.location.href = "/login";
      return;
    }

    // Set up periodic check (every 30 seconds)
    const intervalId = setInterval(() => {
      const currentJwt = localStorage.getItem("jwt");
      if (!currentJwt) {
        window.location.href = "/login";
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, []); 

  return <>{children}</>;
}

export default UserValid;