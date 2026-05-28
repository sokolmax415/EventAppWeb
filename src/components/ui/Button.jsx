import React from "react";

export function Btn({ children, variant = "primary", onClick, disabled, compact = false }) {
  const styles = {
    primary: { background: "#0F172A", color: "#fff", border: "1px solid #0F172A" },
    secondary: { background: "#fff", color: "#374151", border: "1px solid #D1D5DB" },
    danger: { background: "#fff", color: "#DC2626", border: "1px solid #FECACA" },
    dangerSolid: { background: "#DC2626", color: "#fff", border: "1px solid #DC2626" },
    success: { background: "#059669", color: "#fff", border: "1px solid #059669" },
    blue: { background: "#2563EB", color: "#fff", border: "1px solid #2563EB" },
  };
  const s = styles[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        ...s,
        padding: compact ? "6px 10px" : "8px 18px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "opacity .15s",
      }}
    >
      {children}
    </button>
  );
}
