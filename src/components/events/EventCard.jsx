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
      className={`event-card${dimmed ? " is-dimmed" : ""}`}
      style={{ "--status-border": statusBorderColor }}
    >
      <div className="card-head">
        <h3 className="card-title">{event.title}</h3>
        <div className="card-badges">
          {isAdmin && <Badge status={effectiveStatus} small />}
          {!isAdmin && event.is_creator && event.status === "pending" && <Badge status="pending" small />}
          {!isAdmin && event.my_participation_status && <ParticipationBadge status={event.my_participation_status} />}
        </div>
      </div>
      <div className="card-meta">
        {[
          ["📅", fmtDate(event.start_time)],
          ["📍", event.location],
          ["🏷", event.category.name],
          ["👥", `${event.current_participants} / ${event.max_participants} участников`],
        ].map(([icon, text]) => (
          <div key={icon} className="meta-row">
            <span>{icon}</span><span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
