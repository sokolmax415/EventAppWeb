import React, { useState } from "react";

export default function ProfilePage({
  currentUser,
  events = [],
  achievements = [],
  onUpdateProfile,
}) {
  const nameParts = (currentUser?.name || "Иванов Алексей").split(" ");

  const user = {
    user_id: currentUser?.user_id || currentUser?.id || "user-student",
    first_name: currentUser?.first_name || nameParts[1] || "Алексей",
    last_name: currentUser?.last_name || nameParts[0] || "Иванов",
    patronymic: currentUser?.patronymic || "",
    email: currentUser?.email || "user@example.com",
    role: currentUser?.role || "student",
    description: currentUser?.description || "Люблю хакатоны",
    balance: currentUser?.balance ?? 150,
  };

  const profileFullName = [user.last_name, user.first_name, user.patronymic]
    .filter(Boolean)
    .join(" ");

  const [isEditing, setIsEditing] = useState(false);

  const [profileForm, setProfileForm] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    patronymic: user.patronymic,
    description: user.description,
  });

  const [errors, setErrors] = useState({});

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

  function handleChange(field, value) {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  }

  function handleEdit() {
    setProfileForm({
      first_name: user.first_name,
      last_name: user.last_name,
      patronymic: user.patronymic,
      description: user.description,
    });

    setErrors({});
    setIsEditing(true);
  }

  function handleCancel() {
    setProfileForm({
      first_name: user.first_name,
      last_name: user.last_name,
      patronymic: user.patronymic,
      description: user.description,
    });

    setErrors({});
    setIsEditing(false);
  }

  function isOnlyLetters(value) {
    return /^[A-Za-zА-Яа-яЁё]+$/.test(value);
  }

  function handleSubmit() {
    const nextErrors = {};

    const firstName = profileForm.first_name.trim();
    const lastName = profileForm.last_name.trim();
    const patronymic = profileForm.patronymic.trim();

    if (!lastName) {
      nextErrors.last_name = "Укажите фамилию";
    } else if (!isOnlyLetters(lastName)) {
      nextErrors.last_name = "Фамилия может содержать только буквы";
    } else if (lastName.length > 80) {
      nextErrors.last_name = "Фамилия не должна быть длиннее 80 символов";
    }

    if (!firstName) {
      nextErrors.first_name = "Укажите имя";
    } else if (!isOnlyLetters(firstName)) {
      nextErrors.first_name = "Имя может содержать только буквы";
    } else if (firstName.length > 80) {
      nextErrors.first_name = "Имя не должно быть длиннее 80 символов";
    }

    if (patronymic && !isOnlyLetters(patronymic)) {
      nextErrors.patronymic = "Отчество может содержать только буквы";
    } else if (patronymic.length > 80) {
      nextErrors.patronymic = "Отчество не должно быть длиннее 80 символов";
    }

    if (profileForm.description.trim().length > 300) {
      nextErrors.description = "Описание не должно быть длиннее 300 символов";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onUpdateProfile({
      first_name: firstName,
      last_name: lastName,
      patronymic,
      name: `${lastName} ${firstName}`,
      description: profileForm.description.trim(),
    });

    setIsEditing(false);
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
                marginBottom: isEditing ? 14 : 0,
              }}
            >
              <div style={{ flex: 1 }}>
                {isEditing ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#4B5563",
                          marginBottom: 4,
                        }}
                      >
                        Фамилия *
                      </label>

                      <input
                        value={profileForm.last_name}
                        onChange={(event) =>
                          handleChange("last_name", event.target.value)
                        }
                        placeholder="Фамилия"
                        style={{
                          width: "100%",
                          border: `1px solid ${
                            errors.last_name ? "#FCA5A5" : "#D1D5DB"
                          }`,
                          borderRadius: 8,
                          padding: "8px 12px",
                          fontSize: 14,
                          color: "#111827",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />

                      {errors.last_name && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "#DC2626",
                            marginTop: 4,
                          }}
                        >
                          {errors.last_name}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#4B5563",
                          marginBottom: 4,
                        }}
                      >
                        Имя *
                      </label>

                      <input
                        value={profileForm.first_name}
                        onChange={(event) =>
                          handleChange("first_name", event.target.value)
                        }
                        placeholder="Имя"
                        style={{
                          width: "100%",
                          border: `1px solid ${
                            errors.first_name ? "#FCA5A5" : "#D1D5DB"
                          }`,
                          borderRadius: 8,
                          padding: "8px 12px",
                          fontSize: 14,
                          color: "#111827",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />

                      {errors.first_name && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "#DC2626",
                            marginTop: 4,
                          }}
                        >
                          {errors.first_name}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#4B5563",
                          marginBottom: 4,
                        }}
                      >
                        Отчество
                      </label>

                      <input
                        value={profileForm.patronymic}
                        onChange={(event) =>
                          handleChange("patronymic", event.target.value)
                        }
                        placeholder="Отчество"
                        style={{
                          width: "100%",
                          border: `1px solid ${
                            errors.patronymic ? "#FCA5A5" : "#D1D5DB"
                          }`,
                          borderRadius: 8,
                          padding: "8px 12px",
                          fontSize: 14,
                          color: "#111827",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />

                      {errors.patronymic && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "#DC2626",
                            marginTop: 4,
                          }}
                        >
                          {errors.patronymic}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#111827",
                      margin: "0 0 4px",
                    }}
                  >
                    {profileFullName}
                  </h2>
                )}

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
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleEdit}
                  style={{
                    border: "1px solid #D1D5DB",
                    background: "#fff",
                    color: "#374151",
                    borderRadius: 8,
                    padding: "8px 14px",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Редактировать
                </button>
              )}
            </div>

            {isEditing ? (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#4B5563",
                    marginBottom: 4,
                  }}
                >
                  Описание
                </label>

                <textarea
                  value={profileForm.description}
                  onChange={(event) =>
                    handleChange("description", event.target.value)
                  }
                  placeholder="Расскажите о себе"
                  rows={4}
                  style={{
                    width: "100%",
                    border: `1px solid ${
                      errors.description ? "#FCA5A5" : "#D1D5DB"
                    }`,
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 14,
                    color: "#111827",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />

                {errors.description && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#DC2626",
                      marginTop: 4,
                    }}
                  >
                    {errors.description}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 14,
                  }}
                >
                  <button
                    type="button"
                    onClick={handleSubmit}
                    style={{
                      border: "1px solid #0F172A",
                      background: "#0F172A",
                      color: "#fff",
                      borderRadius: 8,
                      padding: "8px 16px",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Сохранить
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                      border: "1px solid #D1D5DB",
                      background: "#fff",
                      color: "#374151",
                      borderRadius: 8,
                      padding: "8px 16px",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
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
            )}
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