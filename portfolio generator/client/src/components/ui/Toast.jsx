import { useState, useEffect, useCallback } from "react";

/**
 * Toast notification system.
 * Usage: import { useToast } from "./Toast"
 * const { toast, ToastContainer } = useToast();
 * toast.success("Done!") / toast.error("Failed")
 */

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "error") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
  };

  const ToastContainer = () => (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="slide-in"
          style={{
            padding: "12px 18px",
            borderRadius: "var(--radius)",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            fontWeight: 500,
            maxWidth: "320px",
            background: t.type === "success" ? "var(--green)" : "var(--red)",
            color: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );

  return { toast, ToastContainer };
}
