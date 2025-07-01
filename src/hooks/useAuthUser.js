import { useState, useEffect } from "react";

function parseToken(token) {
  try {
    const [, payload] = token.split(".");
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default function useAuthUser() {
  const [user, setUser] = useState(null);

  const syncUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = parseToken(token);
      if (userData?.username && userData?.name) {
        setUser({
          username: userData.username,
          name: userData.name,
          photoUrl: userData.photoUrl || null, // ✅ Add photoUrl (optional fallback)
        });
        return;
      }
    }
    setUser(null);
  };

  useEffect(() => {
    syncUser();

    const handleStorageChange = () => syncUser();
    window.addEventListener("authChange", handleStorageChange);
    return () => {
      window.removeEventListener("authChange", handleStorageChange);
    };
  }, []);

  return user;
}
