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
      <div className="page-heading-row">
        <div>
          <h1 className="page-title">
            {isAdmin ? "Все мероприятия" : "Лента событий"}
          </h1>
          <p className="page-subtitle">
            {visible.length} {isAdmin ? "мероприятий" : "доступных"}
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="create-button"
        >
          <span className="plus">+</span> {isAdmin ? "Создать мероприятие" : "Предложить мероприятие"}
        </button>
      </div>

      {isAdmin && (
        <div className="status-legend">
          {Object.entries(STATUS).map(([k, s]) => (
            <div key={k} className="legend-item">
              <span className="legend-swatch" style={{ "--status-border": s.border }} />
              {s.label}
            </div>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">Нет доступных мероприятий</p>
        </div>
      ) : (
        <div className="events-grid">
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
