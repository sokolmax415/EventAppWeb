import React from "react";
import { Badge, ParticipationBadge } from "../ui/Badges.jsx";
import { fmtDate } from "../../utils/date.js";

export function EventCard({ event, isAdmin, onClick }) {
  const effectiveStatus = event.is_finished ? "finished" : event.status;
  const dimmed = ["finished", "cancelled", "rejected"].includes(effectiveStatus);
  const statusBorderColor = {
    pending: "#F59E0B",
    approved: "#10B981",
    rejected: "#EF4444",
    cancelled: "#9CA3AF",
    finished: "#9CA3AF",
  }[effectiveStatus] || "#E5E7EB";

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        border: `1px solid ${statusBorderColor}`,
        borderLeft: `4px solid ${statusBorderColor}`,
        borderRadius: 12,
        padding: "16px 18px",
        cursor: "pointer",
        opacity: dimmed ? 0.65 : 1,
        transition: "box-shadow .15s, border-color .15s",
        boxSizing: "border-box",
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.08)"; e.currentTarget.style.borderColor = statusBorderColor; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = statusBorderColor; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0, lineHeight: 1.4 }}>{event.title}</h3>
        <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {isAdmin && <Badge status={effectiveStatus} small />}
          {!isAdmin && event.is_creator && event.status === "pending" && <Badge status="pending" small />}
          {!isAdmin && event.my_participation_status && <ParticipationBadge status={event.my_participation_status} />}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {[
          ["📅", fmtDate(event.start_time)],
          ["📍", event.location],
          ["🏷", event.category.name],
          ["👥", `${event.current_participants} / ${event.max_participants} участников`],
        ].map(([icon, text]) => (
          <div key={icon} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B7280" }}>
            <span>{icon}</span><span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
