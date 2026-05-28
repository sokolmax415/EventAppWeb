import React from "react";
import { Btn } from "../ui/Button.jsx";
import { ParticipationBadge } from "../ui/Badges.jsx";

export function AttendancePanel({ participants = [], onConfirmAttendance }) {
  if (!participants.length) {
    return (
      <div style={{ fontSize: 13, color: "#9CA3AF" }}>
        У этого мероприятия пока нет участников для подтверждения.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Подтверждение участия</div>
      {participants.map(user => {
        const isAttended = user.status === "attended";
        return (
          <div
            key={user.user_id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              border: "1px solid #E5E7EB",
              borderRadius: 10,
              padding: "10px 12px",
              background: isAttended ? "#F0FDF4" : "#fff",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{user.name}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>{user.email}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ParticipationBadge status={user.status} />
              <Btn
                variant={isAttended ? "secondary" : "success"}
                compact
                disabled={isAttended}
                onClick={() => onConfirmAttendance(user.user_id)}
              >
                {isAttended ? "Подтверждено" : "Подтвердить"}
              </Btn>
            </div>
          </div>
        );
      })}
    </div>
  );
}
