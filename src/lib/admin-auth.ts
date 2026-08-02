"use client";

import * as React from "react";

/**
 * Admin authentication — password embedded per user request.
 * Session stored in sessionStorage (persists across reloads in same tab).
 */
const ADMIN_PASSWORD = "mahbuba1213";
const STORAGE_KEY = "playbeat-admin-auth";

export function useAdminAuth() {
  const [authed, setAuthed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    setAuthed(stored === "true");
    setLoading(false);
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setAuthed(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
  };

  return { authed, loading, login, logout };
}
