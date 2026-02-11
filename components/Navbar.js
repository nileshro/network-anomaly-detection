"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header style={navStyle}>
      <h2 style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
        🔐 NetSecure AI
      </h2>

      <div>
        {!isLoggedIn && (
          <>
            <button onClick={() => router.push("/login")} style={btn}>
              Login
            </button>
            <button onClick={() => router.push("/register")} style={btn}>
              Register
            </button>
          </>
        )}

        {isLoggedIn && (
          <button onClick={logout} style={btn}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 60px",
  background: "#0f172a",
  color: "white",
  borderBottom: "2px solid #1e293b"
};

const btn = {
  marginLeft: "12px",
  padding: "8px 18px",
  background: "#2563eb",
  border: "none",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer"
};
