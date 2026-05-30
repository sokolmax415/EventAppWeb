import React from "react";

export function Btn({ children, variant = "primary", onClick, disabled, compact = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`btn btn--${variant}${compact ? " btn--compact" : ""}`}
    >
      {children}
    </button>
  );
}
