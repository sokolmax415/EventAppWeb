import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

export default function ProfilePage({ currentUser, events = [], onUpdateProfile }) {
  const [achievements, setAchievements] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
    description: currentUser?.description || "",
  });
  const [errors, setErrors] = useState({});

  // Загрузка достижений
  useEffect(() => {
    api.getAchievements()
      .then(data => setAchievements(data.achievements || []))
      .catch(err => console.error("Ошибка загрузки достижений", err));
  }, []);

  // Фильтрация событий для раздела "Участвую" (где my_participation_status не null)
  const participatingEvents = events.filter(event => event.my_participation_status);
  // События, созданные текущим пользователем
  const createdEvents = events.filter(event => event.is_creator);

  const getRoleLabel = (role) => role === "admin" ? "Администратор" : "Студент";

  const formatDate = (isoDate) => {
    if (!isoDate) return "—";
    return new Date(isoDate).toLocaleDateString("ru-RU", {
      day: "numeric", month: "long", year: "numeric"
    });
  };

  const getParticipationStatusLabel = (status) => {
    const labels = { planned: "Планирую посетить", registered: "Записан", attended: "Посетил" };
    return labels[status] || status;
  };

  const getEventStatusLabel = (status) => {
    const labels = { pending: "На модерации", approved: "Одобрено", rejected: "Отклонено", cancelled: "Отменено" };
    return labels[status] || status;
  };

  const handleChange = (field, value) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleEdit = () => {
    setProfileForm({
      name: currentUser.name || "",
      description: currentUser.description || "",
    });
    setErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfileForm({
      name: currentUser.name || "",
      description: currentUser.description || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    const name = profileForm.name.trim();
    const description = profileForm.description.trim();

    if (!name) newErrors.name = "Укажите имя";
    else if (name.length > 100) newErrors.name = "Имя не должно быть длиннее 100 символов";

    if (description.length > 300) newErrors.description = "Описание не должно быть длиннее 300 символов";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    await onUpdateProfile({ name, description });
    setIsEditing(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
          Профиль
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
          Основная информация и активность пользователя
        </p>
      </div>

      {/* Карточка профиля */}
      <section style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EEF2FF", color: "#4F46E5",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700 }}>
            {currentUser.role === "admin" ? "A" : currentUser.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: isEditing ? 14 : 0 }}>
              <div style={{ flex: 1 }}>
                {isEditing ? (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#4B5563", marginBottom: 4 }}>
                        Имя *
                      </label>
                      <input
                        value={profileForm.name}
                        onChange={e => handleChange("name", e.target.value)}
                        style={{
                          width: "100%",
                          border: `1px solid ${errors.name ? "#FCA5A5" : "#D1D5DB"}`,
                          borderRadius: 8,
                          padding: "8px 12px",
                          fontSize: 14,
                        }}
                      />
                      {errors.name && <div style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>{errors.name}</div>}
                    </div>
                  </>
                ) : (
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
                    {currentUser.name || "Пользователь"}
                  </h2>
                )}
                <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 10px" }}>{currentUser.email}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                  <span style={{ background: "#F3F4F6", color: "#374151", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600 }}>
                    {getRoleLabel(currentUser.role)}
                  </span>
                  <span style={{ background: "#ECFDF5", color: "#047857", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600 }}>
                    Баланс: {currentUser.balance ?? 0}
                  </span>
                </div>
              </div>
              {!isEditing && (
                <button onClick={handleEdit} style={{ border: "1px solid #D1D5DB", background: "#fff", color: "#374151",
                  borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}>
                  Редактировать
                </button>
              )}
            </div>
            {isEditing ? (
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#4B5563", marginBottom: 4 }}>
                  Описание
                </label>
                <textarea
                  value={profileForm.description}
                  onChange={e => handleChange("description", e.target.value)}
                  rows={4}
                  style={{ width: "100%", border: `1px solid ${errors.description ? "#FCA5A5" : "#D1D5DB"}`, borderRadius: 8,
                           padding: "8px 12px", fontSize: 14, resize: "vertical" }}
                />
                {errors.description && <div style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>{errors.description}</div>}
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button onClick={handleSubmit} style={{ border: "1px solid #0F172A", background: "#0F172A", color: "#fff",
                    borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
                    Сохранить
                  </button>
                  <button onClick={handleCancel} style={{ border: "1px solid #D1D5DB", background: "#fff", color: "#374151",
                    borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 14, color: "#374151", margin: 0 }}>
                {currentUser.description || "Описание пока не заполнено"}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Три колонки с данными */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {/* Достижения */}
        <section style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Мои достижения</h2>
          {achievements.length === 0 ? (
            <EmptyText text="Достижений пока нет" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {achievements.map(ach => (
                <div key={ach.achievement_id} style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 14, background: "#F9FAFB" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: "0 0 6px" }}>{ach.title}</h3>
                  <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 8px" }}>{ach.description}</p>
                  <p style={{ fontSize: 12, color: "#374151", margin: "0 0 4px" }}>Награда: {ach.reward_amount}</p>
                  <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Получено: {formatDate(ach.awarded_at)}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Участвую */}
        <section style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Участвую</h2>
          {participatingEvents.length === 0 ? (
            <EmptyText text="Пока нет мероприятий с участием" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {participatingEvents.map(ev => (
                <div key={ev.id} style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 14, background: "#F9FAFB" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: "0 0 6px" }}>{ev.title}</h3>
                  <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 6px" }}>Дата: {formatDate(ev.start_time)}</p>
                  <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>Статус: {getParticipationStatusLabel(ev.my_participation_status)}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Мои мероприятия (созданные) */}
        <section style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Мои мероприятия</h2>
          {createdEvents.length === 0 ? (
            <EmptyText text="Пока нет созданных мероприятий" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {createdEvents.map(ev => (
                <div key={ev.id} style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 14, background: "#F9FAFB" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: "0 0 6px" }}>{ev.title}</h3>
                  <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 6px" }}>Создано: {formatDate(ev.created_at || ev.start_time)}</p>
                  <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>Статус: {getEventStatusLabel(ev.status)}</p>
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
    <div style={{ border: "1px dashed #D1D5DB", borderRadius: 12, padding: 18, color: "#9CA3AF",
                  fontSize: 14, textAlign: "center", background: "#F9FAFB" }}>
      {text}
    </div>
  );
}