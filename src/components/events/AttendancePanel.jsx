import React from "react";
import { Btn } from "../ui/Button.jsx";
import { ParticipationBadge } from "../ui/Badges.jsx";

export function AttendancePanel({ participants = [], onConfirmAttendance }) {
  if (!participants.length) {
    return (
      <div className="muted-note">
        У этого мероприятия пока нет участников для подтверждения.
      </div>
    );
  }

  return (
    <div className="attendance-list">
      <div className="attendance-title">Подтверждение участия</div>
      {participants.map(user => {
        const isAttended = user.status === "attended";
        return (
          <div
            key={user.user_id}
            className={`attendance-row${isAttended ? " is-attended" : ""}`}
          >
            <div>
              <div className="person-name">{user.name}</div>
              <div className="person-email">{user.email}</div>
            </div>
            <div className="attendance-actions">
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
