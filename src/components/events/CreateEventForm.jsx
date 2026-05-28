import React, { useState } from "react";
import { CATEGORIES } from "../../constants/events.js";
import { getMinDateTimeLocal } from "../../utils/date.js";
import { Btn } from "../ui/Button.jsx";

export function CreateEventForm({ role, currentUser, onSubmit, onCancel }) {
  const isAdmin = role === "admin";
  const minDateTime = getMinDateTimeLocal();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "IT",
    location: "",
    start_time: "",
    end_time: "",
    max_participants: "50",
  });
  const [errors, setErrors] = useState({});

  function p(key) {
    return e => setForm(prev => ({ ...prev, [key]: e.target.value }));
  }

  function validate() {
    const e = {};
    const maxParticipants = Number(form.max_participants);
    if (!form.title.trim()) e.title = "Обязательное поле";
    if (!form.location.trim()) e.location = "Обязательное поле";
    if (!Number.isInteger(maxParticipants) || maxParticipants < 1) {
      e.max_participants = "Количество участников должно быть больше 0";
    }
    if (!form.start_time) e.start_time = "Укажите время начала";
    if (!form.end_time) e.end_time = "Укажите время окончания";
    if (form.start_time && form.start_time < minDateTime) {
      e.start_time = "Дата начала не может быть в прошлом";
    }
    if (form.end_time && form.end_time < minDateTime) {
      e.end_time = "Дата окончания не может быть в прошлом";
    }
    if (form.start_time && form.end_time && form.start_time >= form.end_time) {
      e.end_time = "Должно быть позже начала";
    }
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSubmit({
      id: "new-" + Date.now(),
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      category: { id: "new", name: form.category },
      start_time: form.start_time + ":00Z",
      end_time: form.end_time + ":00Z",
      current_participants: 0,
      max_participants: Number(form.max_participants),
      my_participation_status: null,
      is_creator: !isAdmin,
      is_finished: false,
      status: isAdmin ? "approved" : "pending",
      creator: { id: currentUser.user_id, name: currentUser.name },
      moderated_by: isAdmin ? { id: currentUser.user_id, name: currentUser.name } : null,
      participants: [],
    });
  }

  function field(key, label, el) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: "#4B5563" }}>{label}</label>
        {el}
        {errors[key] && <span style={{ fontSize: 11, color: "#DC2626" }}>{errors[key]}</span>}
      </div>
    );
  }

  const inputStyle = {
    border: "1px solid #D1D5DB",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    color: "#111827",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    background: "#fff",
  };

  return (
    <div>
      <button onClick={onCancel}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280",
          fontSize: 13, padding: "0 0 20px", display: "flex", alignItems: "center", gap: 6 }}>
        ← Назад
      </button>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>
          {isAdmin ? "Создать мероприятие" : "Предложить мероприятие"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {field("title", "Название *",
            <input value={form.title} onChange={p("title")} placeholder="Название мероприятия"
              style={{ ...inputStyle, borderColor: errors.title ? "#FCA5A5" : "#D1D5DB" }} />
          )}
          {field("description", "Описание",
            <textarea value={form.description} onChange={p("description")}
              placeholder="Расскажите о мероприятии" rows={4}
              style={{ ...inputStyle, resize: "vertical" }} />
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("category", "Категория",
              <select value={form.category} onChange={p("category")} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            )}
            {field("location", "Локация *",
              <input value={form.location} onChange={p("location")} placeholder="Город или Онлайн"
                style={{ ...inputStyle, borderColor: errors.location ? "#FCA5A5" : "#D1D5DB" }} />
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("start_time", "Начало *",
              <input type="datetime-local" value={form.start_time} min={minDateTime} onChange={p("start_time")}
                style={{ ...inputStyle, borderColor: errors.start_time ? "#FCA5A5" : "#D1D5DB" }} />
            )}
            {field("end_time", "Конец *",
              <input type="datetime-local" value={form.end_time} min={form.start_time || minDateTime} onChange={p("end_time")}
                style={{ ...inputStyle, borderColor: errors.end_time ? "#FCA5A5" : "#D1D5DB" }} />
            )}
          </div>
          {field("max_participants", "Макс. участников",
            <input type="number" value={form.max_participants} onChange={p("max_participants")}
              min={1} max={10000} style={{ ...inputStyle, width: 120 }} />
          )}

          <div style={{ display: "flex", gap: 10, paddingTop: 6 }}>
            <Btn variant="primary" onClick={handleSubmit}>
              {isAdmin ? "Создать и опубликовать" : "Отправить на модерацию"}
            </Btn>
            <Btn variant="secondary" onClick={onCancel}>Отмена</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
