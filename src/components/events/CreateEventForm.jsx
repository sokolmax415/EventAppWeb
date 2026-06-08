import React, { useState } from "react";
import { getMinDateTimeLocal } from "../../utils/date.js";
import { Btn } from "../ui/Button.jsx";

export function CreateEventForm({ role, currentUser, categories = [], onSubmit, onCancel }) {
  const isAdmin = role === "admin";
  const minDateTime = getMinDateTimeLocal();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",          // ← храним ID категории
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
    if (!form.category_id) e.category_id = "Выберите категорию";
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
    // Выбираем название категории для отображения (не обязательно для API)
    const selectedCategory = categories.find(cat => cat.id === form.category_id);
    onSubmit({
      category_id: form.category_id,          // ← отправляем ID
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      start_time: form.start_time + ":00Z",
      end_time: form.end_time + ":00Z",
      max_participants: Number(form.max_participants),
      // Ниже поля, которые могут быть нужны для временного отображения в UI (но бэкенд их перезапишет)
      // Они не обязательны для API, но могут использоваться в локальном состоянии.
      category: { id: form.category_id, name: selectedCategory?.name || "" },
      current_participants: 0,
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
      <div className="form-field">
        <label className="form-label">{label}</label>
        {el}
        {errors[key] && <span className="field-error">{errors[key]}</span>}
      </div>
    );
  }

  return (
    <div>
      <button onClick={onCancel} className="back-button">
        ← Назад
      </button>

      <div className="panel">
        <h2 className="form-title">
          {isAdmin ? "Создать мероприятие" : "Предложить мероприятие"}
        </h2>

        <div className="form">
          {field("title", "Название *",
            <input value={form.title} onChange={p("title")} placeholder="Название мероприятия"
              className={`form-input${errors.title ? " has-error" : ""}`} />
          )}
          {field("description", "Описание",
            <textarea value={form.description} onChange={p("description")}
              placeholder="Расскажите о мероприятии" rows={4}
              className="form-textarea" />
          )}
          <div className="form-grid">
            {field("category_id", "Категория *",
            <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="form-select">
            <option value="">Выберите категорию</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
            )}
            {field("location", "Локация *",
              <input value={form.location} onChange={p("location")} placeholder="Город или Онлайн"
                className={`form-input${errors.location ? " has-error" : ""}`} />
            )}
          </div>
          <div className="form-grid">
            {field("start_time", "Начало *",
              <input type="datetime-local" value={form.start_time} min={minDateTime} onChange={p("start_time")}
                className={`form-input${errors.start_time ? " has-error" : ""}`} />
            )}
            {field("end_time", "Конец *",
              <input type="datetime-local" value={form.end_time} min={form.start_time || minDateTime} onChange={p("end_time")}
                className={`form-input${errors.end_time ? " has-error" : ""}`} />
            )}
          </div>
          {field("max_participants", "Макс. участников",
            <input type="number" value={form.max_participants} onChange={p("max_participants")}
              min={1} max={10000} className={`form-input form-input--number${errors.max_participants ? " has-error" : ""}`} />
          )}

          <div className="form-actions">
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