import React from "react";

export function ToastStack({ toasts }) {
  if (!toasts.length) return null;

  return (
    <div style={{
      position: "fixed",
      right: 24,
      bottom: 24,
      zIndex: 1100,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      alignItems: "flex-end",
      maxWidth: "min(420px, calc(100vw - 40px))",
      pointerEvents: "none",
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            background: "#0F172A",
            color: "#fff",
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: 12,
            boxShadow: "0 14px 32px rgba(15, 23, 42, 0.25)",
            padding: "12px 14px",
            fontSize: 13,
            fontWeight: 500,
            lineHeight: 1.45,
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
