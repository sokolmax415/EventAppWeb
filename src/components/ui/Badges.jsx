import React from "react";
import { STATUS } from "../../constants/events.js";

export function Badge({ status, small }) {
  const s = STATUS[status] || STATUS.approved;
  return (
    <span
      className={`badge${small ? " badge--small" : ""}`}
      style={{ "--badge-bg": s.bg, "--badge-color": s.color, "--badge-border": s.border }}
    >
      {s.label}
    </span>
  );
}

export function ParticipationBadge({ status }) {
  const map = {
    registered: { label: "Записан", bg: "#DBEAFE", color: "#1E3A8A" },
    planned: { label: "Планирую", bg: "#EDE9FE", color: "#3730A3" },
    attended: { label: "Посетил", bg: "#D1FAE5", color: "#064E3B" },
  };
  const s = map[status];
  if (!s) return null;

  return (
    <span
      className="participation-badge"
      style={{ "--badge-bg": s.bg, "--badge-color": s.color }}
    >
      {s.label}
    </span>
  );
}
