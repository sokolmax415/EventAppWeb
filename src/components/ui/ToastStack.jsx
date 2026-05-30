import React from "react";

export function ToastStack({ toasts }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-stack">
      {toasts.map(toast => (
        <div key={toast.id} className="toast">
          {toast.message}
        </div>
      ))}
    </div>
  );
}
