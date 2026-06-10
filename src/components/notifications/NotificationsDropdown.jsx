import React, { useState } from "react";

export function NotificationsDropdown({ notifications = [], onNotificationClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const formatDate = (isoDate) => {
    if (!isoDate) return "—";
    return new Date(isoDate).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleNotificationClick = (notification) => {
    setIsOpen(false);
    onNotificationClick(notification.id);
  };

  return (
    <div className="notifications-root">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="notifications-button"
        aria-label="Уведомления"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notifications-count">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-menu">
          <div className="notifications-header">
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>
                Уведомления
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6B7280" }}>
                {unreadCount > 0 ? `Непрочитанных: ${unreadCount}` : "Нет новых уведомлений"}
              </p>
            </div>
            <button
              type="button"
              className="notifications-close"
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть уведомления"
            >
              ×
            </button>
          </div>

          {notifications.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
              Уведомлений пока нет
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: 12,
                    padding: "14px 18px",
                    border: "none",
                    borderBottom: "1px solid #F3F4F6",
                    background: notification.is_read ? "#fff" : "#F8FAFF",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: notification.is_read ? "#D1D5DB" : "#6366F1",
                      marginTop: 7,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: notification.is_read ? 500 : 700,
                        color: "#111827",
                        marginBottom: 4,
                      }}
                    >
                      Уведомление
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#4B5563",
                        lineHeight: 1.4,
                        marginBottom: 6,
                      }}
                    >
                      {notification.message}
                    </div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                      {formatDate(notification.created_at)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
