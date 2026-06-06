import React from "react";

export default function ProfilePage({ currentUser, events = [], achievements = [] }) {
  const user = {
    user_id: currentUser?.user_id || currentUser?.id || "user-student",
    name: currentUser?.name || "Алексей Иванов",
    email: currentUser?.email || "user@example.com",
    role: currentUser?.role || "student",
    description: currentUser?.description || "Люблю хакатоны",
    balance: currentUser?.balance ?? 150,
  };

  const userAchievements = achievements.filter(
    (achievement) => achievement.user_id === user.user_id
  );

  const participatingEvents = events.filter((event) => {
    return Boolean(event.my_participation_status);
  });

  const createdEvents = events.filter((event) => {
    return event.is_creator || event.creator?.id === user.user_id;
  });

  function formatDate(isoDate) {
    if (!isoDate) return "—";

    return new Date(isoDate).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function getRoleLabel(role) {
    if (role === "admin") return "Администратор";
    return "Студент";
  }

  function getParticipationStatusLabel(status) {
    const statuses = {
      planned: "Планирую посетить",
      registered: "Записан",
      attended: "Посетил",
    };

    return statuses[status] || status;
  }

  function getEventStatusLabel(status) {
    const statuses = {
      pending: "На модерации",
      approved: "Одобрено",
      rejected: "Отклонено",
      cancelled: "Отменено",
    };

    return statuses[status] || status;
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#111827",
            margin: "0 0 6px",
          }}
        >
          Профиль
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "#6B7280",
            margin: 0,
          }}
        >
          Основная информация и активность пользователя
        </p>
      </div>

      <section
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 14,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#EEF2FF",
              color: "#4F46E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {user.role === "admin" ? "A" : "АИ"}
          </div>

          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 4px",
              }}
            >
              {user.name}
            </h2>

            <p
              style={{
                fontSize: 14,
                color: "#6B7280",
                margin: "0 0 10px",
              }}
            >
              {user.email}
            </p>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  background: "#F3F4F6",
                  color: "#374151",
                  borderRadius: 20,
                  padding: "4px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {getRoleLabel(user.role)}
              </span>

              <span
                style={{
                  background: "#ECFDF5",
                  color: "#047857",
                  borderRadius: 20,
                  padding: "4px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Баланс: {user.balance}
              </span>
            </div>

            <p
              style={{
                fontSize: 14,
                color: "#374151",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {user.description || "Описание пока не заполнено"}
            </p>
          </div>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 18,
        }}
      >
        <section
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 14px",
            }}
          >
            Мои достижения
          </h2>

          {userAchievements.length === 0 ? (
            <EmptyText text="Достижений пока нет" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {userAchievements.map((achievement) => (
                <div
                  key={achievement.achievement_id}
                  style={{
                    border: "1px solid #E5E7EB",
                    borderRadius: 12,
                    padding: 14,
                    background: "#F9FAFB",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#111827",
                      margin: "0 0 6px",
                    }}
                  >
                    {achievement.title}
                  </h3>

                  <p
                    style={{
                      fontSize: 13,
                      color: "#6B7280",
                      margin: "0 0 8px",
                      lineHeight: 1.4,
                    }}
                  >
                    {achievement.description}
                  </p>

                  <p
                    style={{
                      fontSize: 12,
                      color: "#374151",
                      margin: "0 0 4px",
                    }}
                  >
                    Награда: {achievement.reward_amount}
                  </p>

                  <p
                    style={{
                      fontSize: 12,
                      color: "#9CA3AF",
                      margin: 0,
                    }}
                  >
                    Получено: {formatDate(achievement.awarded_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 14px",
            }}
          >
            Участвую
          </h2>

          {participatingEvents.length === 0 ? (
            <EmptyText text="Пока нет мероприятий с участием" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {participatingEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    border: "1px solid #E5E7EB",
                    borderRadius: 12,
                    padding: 14,
                    background: "#F9FAFB",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#111827",
                      margin: "0 0 6px",
                    }}
                  >
                    {event.title}
                  </h3>

                  <p
                    style={{
                      fontSize: 13,
                      color: "#6B7280",
                      margin: "0 0 6px",
                    }}
                  >
                    Дата: {formatDate(event.start_time)}
                  </p>

                  <p
                    style={{
                      fontSize: 13,
                      color: "#374151",
                      margin: 0,
                    }}
                  >
                    Статус:{" "}
                    {getParticipationStatusLabel(event.my_participation_status)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 14px",
            }}
          >
            Мои мероприятия
          </h2>

          {createdEvents.length === 0 ? (
            <EmptyText text="Пока нет созданных мероприятий" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {createdEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    border: "1px solid #E5E7EB",
                    borderRadius: 12,
                    padding: 14,
                    background: "#F9FAFB",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#111827",
                      margin: "0 0 6px",
                    }}
                  >
                    {event.title}
                  </h3>

                  <p
                    style={{
                      fontSize: 13,
                      color: "#6B7280",
                      margin: "0 0 6px",
                    }}
                  >
                    Создано: {formatDate(event.created_at || event.start_time)}
                  </p>

                  <p
                    style={{
                      fontSize: 13,
                      color: "#374151",
                      margin: 0,
                    }}
                  >
                    Статус: {getEventStatusLabel(event.status)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function EmptyText({ text }) {
  return (
    <div
      style={{
        border: "1px dashed #D1D5DB",
        borderRadius: 12,
        padding: 18,
        color: "#9CA3AF",
        fontSize: 14,
        textAlign: "center",
        background: "#F9FAFB",
      }}
    >
      {text}
    </div>
  );
}