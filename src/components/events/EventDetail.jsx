import React, { useState } from "react";
import { PART_MSG, STATUS } from "../../constants/events.js";
import { fmtDate } from "../../utils/date.js";
import { Btn } from "../ui/Button.jsx";
import { Badge } from "../ui/Badges.jsx";
import { ConfirmDialog } from "../ui/ConfirmDialog.jsx";
import { AttendancePanel } from "./AttendancePanel.jsx";

export function EventDetail({ event, role,currentUser, categories, onBack, onUpdate, onDelete, onApprove, onReject, onConfirmAttendance,onRegister,onPlan,onCancelParticipation }) {
  const isAdmin = role === "admin";
  console.log(currentUser)
  const isCreator = event.creator?.id === currentUser?.user_id;
  console.log(isCreator)
  const isOwnPending = isCreator && event.status === "pending";
  const canAdminEdit = isAdmin && !["rejected", "cancelled"].includes(event.status);
  const canEdit = canAdminEdit || (!isAdmin && isOwnPending);
  const [editing, setEditing] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null)
  const [ed, setEd] = useState({
  title: event.title,
  description: event.description,
  location: event.location,
  start_time: event.start_time.slice(0, 16),
  end_time: event.end_time.slice(0, 16),
  max_participants: String(event.max_participants),
  category_id: event.category.id,
});

  const effectiveStatus = event.is_finished ? "finished" : event.status;
  const partStatus = event.my_participation_status;
  const pm = partStatus ? PART_MSG[partStatus] : null;
  const isFull = event.current_participants >= event.max_participants;
  const [errors, setErrors] = useState({});

  // Массив имён категорий для селекта
  const categoryNames = categories.map(c => c.name);

  function patch(key) {
    return v => setEd(prev => ({ ...prev, [key]: v }));
  }

  function saveEdit() {
    const nextMaxParticipants = Number(ed.max_participants);
    const nextErrors = {};
    if (!Number.isInteger(nextMaxParticipants) || nextMaxParticipants < 1) {
      nextErrors.max_participants = "Количество участников должно быть больше 0";
    } else if (nextMaxParticipants < event.current_participants) {
      nextErrors.max_participants = `Лимит не может быть меньше текущих участников: ${event.current_participants}`;
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    onUpdate({
      ...event,
      title: ed.title,
      description: ed.description,
      location: ed.location,
      start_time: ed.start_time + ":00Z",
      end_time: ed.end_time + ":00Z",
      max_participants: nextMaxParticipants,
      category_id: ed.category_id,
    });
    setErrors({});
    setEditing(false);
  }

  function participate(status) {
    if (status === "registered") onRegister(event.id);
    else if (status === "planned") onPlan(event.id);
  }

  function unparticipate() {
    onCancelParticipation(event.id);
  }

  function requestReject() {
    setConfirmAction({
      type: "reject",
      title: "Отклонить мероприятие?",
      message: `Вы действительно хотите отклонить мероприятие «${event.title}»? После этого оно не будет опубликовано для студентов.`,
      confirmLabel: "Отклонить",
      confirmVariant: "dangerSolid",
    });
  }

  function requestDelete() {
    setConfirmAction({
      type: "delete",
      title: "Удалить мероприятие?",
      message: `Вы действительно хотите удалить мероприятие «${event.title}»? Мероприятие будет переведено в статус «Отменено».`,
      confirmLabel: "Удалить",
      confirmVariant: "dangerSolid",
    });
  }

  function confirmPendingAction() {
    if (confirmAction?.type === "reject") onReject(event.id);
    if (confirmAction?.type === "delete") onDelete(event.id);
    setConfirmAction(null);
  }
  console.log("Full event object:", event);
  return (
    <div>
      <button onClick={onBack} className="back-button">
        ← Назад к событиям
      </button>

      <div className="panel">
        <div className="detail-title-row">
          <div className="detail-title-wrap">
            {editing ? (
              <input value={ed.title} onChange={e => patch("title")(e.target.value)} className="title-input" />
            ) : (
              <h1 className="detail-title">{event.title}</h1>
            )}
          </div>
          <Badge status={effectiveStatus} />
        </div>

        <div className="info-grid">
          {[
            { label: "Локация", field: "location", type: "text", value: event.location },
            { label: "Категория", field: "category", type: "select", value: event.category.name },
            { label: "Начало", field: "start_time", type: "datetime-local", value: fmtDate(event.start_time) },
            { label: "Конец", field: "end_time", type: "datetime-local", value: fmtDate(event.end_time) },
            { label: "Участники", field: "max_participants", type: "number", value: `${event.current_participants} / ${event.max_participants}` },
            { label: "Организатор", value: event.creator?.name || "—" },
          ].map(({ label, field, type, value }) => (
            <div key={label}>
              <div className="field-label">{label}</div>
              {editing && field ? (
                type === "select" ? (
                  <select value={ed.category_id} onChange={e => patch("category_id")(e.target.value)} className="inline-select">
                    {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
        </select>
                ) : (
                  <input
                    type={type}
                    value={ed[field]}
                    min={field === "max_participants" ? Math.max(1, event.current_participants) : undefined}
                    onChange={e => patch(field)(e.target.value)}
                    className={`inline-input${type === "number" ? " inline-input--number" : ""}${errors[field] ? " has-error" : ""}`}
                  />
                )
              ) : (
                <div className="field-value">{value}</div>
              )}
              {editing && errors[field] && <div className="field-error">{errors[field]}</div>}
            </div>
          ))}
        </div>

        <div className="description-block">
          <div className="section-label">Описание</div>
          {editing ? (
            <textarea value={ed.description} onChange={e => patch("description")(e.target.value)} rows={4} className="textarea-edit" />
          ) : (
            <p className="description-text">{event.description ? event.description : "Описание отсутствует"}</p>
          )}
        </div>

        <div className="actions-section">
          {pm && !isOwnPending && !isAdmin && (
            <div className="status-message" style={{ "--msg-bg": pm.bg, "--msg-color": pm.color }}>
              {pm.text}
            </div>
          )}

          {canEdit && !isAdmin && (
            <div className="actions-row">
              {editing ? (
                <>
                  <Btn variant="success" onClick={saveEdit}>Сохранить изменения</Btn>
                  <Btn variant="secondary" onClick={() => setEditing(false)}>Отмена</Btn>
                  <Btn variant="danger" onClick={requestDelete}>🗑 Удалить мероприятие</Btn>
                </>
              ) : (
                <>
                  <Btn variant="primary" onClick={() => setEditing(true)}>✏️ Редактировать</Btn>
                  <Btn variant="danger" onClick={requestDelete}>🗑 Удалить мероприятие</Btn>
                </>
              )}
            </div>
          )}

          {!isOwnPending && !isAdmin && !event.is_finished && (
            <div className="actions-row">
              {partStatus === null && (
                <>
                  <Btn variant="secondary" onClick={() => participate("planned")}>Планирую посетить</Btn>
                  {isFull ? (
                    <div className="sold-out-message">Все места заняты</div>
                  ) : (
                    <Btn variant="blue" onClick={() => participate("registered")}>Записаться</Btn>
                  )}
                </>
              )}
              {partStatus === "planned" && (
                <>
                  {!isFull && <Btn variant="blue" onClick={() => participate("registered")}>Записаться</Btn>}
                  <Btn variant="secondary" onClick={unparticipate}>Отменить участие</Btn>
                  {isFull && <div className="sold-out-message">Все места заняты</div>}
                </>
              )}
              {partStatus === "registered" && <Btn variant="danger" onClick={unparticipate}>Отписаться</Btn>}
            </div>
          )}

          {!isOwnPending && !isAdmin && event.is_finished && (
            <div className="muted-note">Мероприятие завершено — участие недоступно</div>
          )}

          {isAdmin && (
            <div className="actions-stack">
              <div className="actions-row">
                {editing ? (
                  <>
                    <Btn variant="success" onClick={saveEdit}>Сохранить изменения</Btn>
                    <Btn variant="secondary" onClick={() => setEditing(false)}>Отмена</Btn>
                  </>
                ) : (
                  <>
                    {event.status === "pending" && !event.is_finished && (
                      <>
                        <Btn variant="success" onClick={() => onApprove(event.id)}>Одобрить</Btn>
                        <Btn variant="dangerSolid" onClick={requestReject}>Отклонить</Btn>
                      </>
                    )}
                    {canAdminEdit && <Btn variant="primary" onClick={() => setEditing(true)}>✏️ Редактировать</Btn>}
                    <Btn variant="danger" onClick={requestDelete}>🗑 Удалить мероприятие</Btn>
                  </>
                )}
              </div>
              {event.is_finished && (
                <AttendancePanel
                  participants={event.participants}
                  onConfirmAttendance={userId => onConfirmAttendance(event.id, userId)}
                />
              )}
              {!event.is_finished && event.status !== "pending" && event.status !== "rejected" && !editing && (
                <div className="muted-note">Администратор может редактировать или отменить мероприятие.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {confirmAction && (
        <ConfirmDialog
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel={confirmAction.confirmLabel}
          confirmVariant={confirmAction.confirmVariant}
          onConfirm={confirmPendingAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}