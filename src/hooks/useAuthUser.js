// src/hooks/useAuthUser.js
import { useState, useEffect } from "react";

function parseToken(token) {
    try {
        const [, payload] = token.split(".");
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const json = atob(base64);
        return JSON.parse(json);
    } catch (err) {
        console.error("Invalid token", err);
        return null;
    }
}

export default function useAuthUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const userData = parseToken(token);
        if (userData?.username && userData?.name) {
            setUser({ username: userData.username, name: userData.name });
        }
    }, []);

    return user; // returns { username, name } or null
}
