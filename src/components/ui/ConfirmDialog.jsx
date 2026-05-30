import React from "react";
import { Btn } from "./Button.jsx";

export function ConfirmDialog({ title, message, confirmLabel, confirmVariant = "dangerSolid", onConfirm, onCancel }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-backdrop"
    >
      <div className="modal">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <Btn variant="secondary" onClick={onCancel}>Отмена</Btn>
          <Btn variant={confirmVariant} onClick={onConfirm}>{confirmLabel}</Btn>
        </div>
      </div>
    </div>
  );
}
