import React from "react";
import { STATUS } from "../../constants/events.js";
import { EventCard } from "./EventCard.jsx";

export function EventsList({ events, role, onEventClick, onCreateClick }) {
  const isAdmin = role === "admin";
  const visible = isAdmin ? events : events.filter(e => {
    if (e.status === "rejected" || e.status === "cancelled") return false;
    if (e.is_finished) return false;
    if (e.status === "pending" && !e.is_creator) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>
            {isAdmin ? "Все мероприятия" : "Лента событий"}
          </h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>
            {visible.length} {isAdmin ? "мероприятий" : "доступных"}
          </p>
        </div>
        <button
          onClick={onCreateClick}
          style={{
            background: "#0F172A",
            color: "#fff",
            border: "none",
            padding: "9px 16px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 16 }}>+</span> {isAdmin ? "Создать мероприятие" : "Предложить мероприятие"}
        </button>
      </div>

      {isAdmin && (
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          {Object.entries(STATUS).map(([k, s]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6B7280" }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: s.border, display: "inline-block" }} />
              {s.label}
            </div>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#9CA3AF" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 15 }}>Нет доступных мероприятий</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {visible.map(e => (
            <EventCard
              key={e.id}
              event={e}
              isAdmin={isAdmin}
              onClick={() => onEventClick(e.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
