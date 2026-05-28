import React from "react";
import { Btn } from "./Button.jsx";

export function ConfirmDialog({ title, message, confirmLabel, confirmVariant = "dangerSolid", onConfirm, onCancel }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={{
        width: "min(440px, 100%)",
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #E5E7EB",
        boxShadow: "0 20px 50px rgba(15, 23, 42, 0.2)",
        padding: 24,
      }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 18, color: "#111827" }}>{title}</h2>
        <p style={{ margin: "0 0 22px", fontSize: 14, lineHeight: 1.5, color: "#4B5563" }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <Btn variant="secondary" onClick={onCancel}>Отмена</Btn>
          <Btn variant={confirmVariant} onClick={onConfirm}>{confirmLabel}</Btn>
        </div>
      </div>
    </div>
  );
}
