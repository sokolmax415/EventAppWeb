import React from "react";

export function NotificationDetailPage({ notification, onBack }) {
  if (!notification) {
    return (
      <div>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6B7280",
            fontSize: 13,
            padding: "0 0 20px",
          }}
        >
          ← Назад
        </button>
        <div
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 14,
            padding: 24,
            color: "#6B7280",
          }}
        >
          Уведомление не найдено
        </div>
      </div>
    );
  }

  const formatDateTime = (isoDate) => {
    if (!isoDate) return "—";
    return new Date(isoDate).toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#6B7280",
          fontSize: 13,
          padding: "0 0 20px",
        }}
      >
        ← Назад к мероприятиям
      </button>

      <section
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 14,
          padding: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            marginBottom: 22,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 20,
                background: notification.is_read ? "#F3F4F6" : "#EEF2FF",
                color: notification.is_read ? "#4B5563" : "#4F46E5",
                padding: "4px 10px",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              {notification.is_read ? "Прочитано" : "Новое"}
            </div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              Уведомление
            </h2>
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#9CA3AF",
              whiteSpace: "nowrap",
              paddingTop: 8,
            }}
          >
            {formatDateTime(notification.created_at)}
          </div>
        </div>

        <div
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            padding: 18,
            background: "#F9FAFB",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: "#374151",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {notification.message}
          </div>
        </div>
      </section>
    </div>
  );
}