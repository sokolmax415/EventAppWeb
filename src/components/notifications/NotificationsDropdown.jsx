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
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          position: "relative",
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: "1px solid #E5E7EB",
          background: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
        }}
        aria-label="Уведомления"
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 18,
              height: 18,
              borderRadius: 999,
              background: "#EF4444",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 5px",
              border: "2px solid #fff",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: 48,
            right: 0,
            width: 380,
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 14,
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.16)",
            zIndex: 20,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 18px",
              borderBottom: "1px solid #F3F4F6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>
                Уведомления
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6B7280" }}>
                {unreadCount > 0 ? `Непрочитанных: ${unreadCount}` : "Нет новых уведомлений"}
              </p>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
              Уведомлений пока нет
            </div>
          ) : (
            <div style={{ maxHeight: 360, overflowY: "auto" }}>
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