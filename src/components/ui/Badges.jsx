import React from "react";
import { STATUS } from "../../constants/events.js";

export function Badge({ status, small }) {
  const s = STATUS[status] || STATUS.approved;
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      padding: small ? "2px 8px" : "3px 10px",
      borderRadius: 20,
      fontSize: small ? 11 : 12,
      fontWeight: 600,
      whiteSpace: "nowrap",
      display: "inline-block",
    }}>
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
    <span style={{
      background: s.bg,
      color: s.color,
      padding: "2px 8px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
    }}>
      {s.label}
    </span>
  );
}
