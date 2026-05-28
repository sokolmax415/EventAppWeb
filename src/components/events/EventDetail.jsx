import React, { useState } from "react";
import { CATEGORIES, PART_MSG, STATUS } from "../../constants/events.js";
import { fmtDate } from "../../utils/date.js";
import { Btn } from "../ui/Button.jsx";
import { Badge } from "../ui/Badges.jsx";
import { ConfirmDialog } from "../ui/ConfirmDialog.jsx";
import { AttendancePanel } from "./AttendancePanel.jsx";

export function EventDetail({ event, role, onBack, onUpdate, onDelete, onApprove, onReject, onConfirmAttendance }) {
  const isAdmin = role === "admin";
  const isOwnPending = event.is_creator && event.status === "pending";
  const canAdminEdit = isAdmin && !["rejected", "cancelled"].includes(event.status);
  const canEdit = canAdminEdit || (!isAdmin && isOwnPending);
  const [editing, setEditing] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [ed, setEd] = useState({
    title: event.title,
    description: event.description,
    location: event.location,
    start_time: event.start_time.slice(0, 16),
    end_time: event.end_time.slice(0, 16),
    max_participants: String(event.max_participants),
    category: event.category.name,
  });

  const effectiveStatus = event.is_finished ? "finished" : event.status;
  const partStatus = event.my_participation_status;
  const pm = partStatus ? PART_MSG[partStatus] : null;
  const isFull = event.current_participants >= event.max_participants;
  const [errors, setErrors] = useState({});

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
      category: { ...event.category, name: ed.category },
    });
    setErrors({});
    setEditing(false);
  }

  function participate(status) {
    onUpdate({ ...event, my_participation_status: status });
  }

  function unparticipate() {
    onUpdate({ ...event, my_participation_status: null });
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

  return (
    <div>
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280",
          fontSize: 13, padding: "0 0 20px", display: "flex", alignItems: "center", gap: 6 }}
      >
        ← Назад к событиям
      </button>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            {editing ? (
              <input value={ed.title} onChange={e => patch("title")(e.target.value)}
                style={{ fontSize: 22, fontWeight: 700, color: "#111827", border: "none",
                  borderBottom: "2px solid #6366F1", outline: "none", width: "100%", background: "transparent" }} />
            ) : (
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>{event.title}</h1>
            )}
          </div>
          <Badge status={effectiveStatus} />
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16, background: "#F9FAFB", borderRadius: 10, padding: 18, marginBottom: 22,
        }}>
          {[
            { label: "📍 Локация", field: "location", type: "text", value: event.location },
            { label: "🏷 Категория", field: "category", type: "select", value: event.category.name },
            { label: "🕐 Начало", field: "start_time", type: "datetime-local", value: fmtDate(event.start_time) },
            { label: "🕐 Конец", field: "end_time", type: "datetime-local", value: fmtDate(event.end_time) },
            { label: "👥 Участники", field: "max_participants", type: "number", value: `${event.current_participants} / ${event.max_participants}` },
            { label: "👤 Организатор", value: event.creator?.name || "—" },
          ].map(({ label, field, type, value }) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>{label}</div>
              {editing && field ? (
                type === "select" ? (
                  <select value={ed[field]} onChange={e => patch(field)(e.target.value)}
                    style={{ border: "1px solid #D1D5DB", borderRadius: 6, padding: "4px 8px", fontSize: 13, background: "#fff" }}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                ) : (
                  <input
                    type={type}
                    value={ed[field]}
                    min={field === "max_participants" ? Math.max(1, event.current_participants) : undefined}
                    onChange={e => patch(field)(e.target.value)}
                    style={{ border: `1px solid ${errors[field] ? "#FCA5A5" : "#D1D5DB"}`, borderRadius: 6, padding: "4px 8px",
                      fontSize: 13, background: "#fff", width: type === "number" ? 80 : "100%", boxSizing: "border-box" }} />
                )
              ) : (
                <div style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{value}</div>
              )}
              {editing && errors[field] && (
                <div style={{ marginTop: 4, fontSize: 11, color: "#DC2626" }}>{errors[field]}</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#6B7280", marginBottom: 8 }}>Описание</div>
          {editing ? (
            <textarea value={ed.description} onChange={e => patch("description")(e.target.value)}
              rows={4} style={{ width: "100%", border: "1px solid #D1D5DB", borderRadius: 8,
                padding: "8px 12px", fontSize: 13, color: "#374151", resize: "vertical",
                outline: "none", boxSizing: "border-box" }} />
          ) : (
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>{event.description}</p>
          )}
        </div>

        <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 20 }}>
          {pm && !isOwnPending && !isAdmin && (
            <div style={{ background: pm.bg, color: pm.color, borderRadius: 8, padding: "10px 14px",
              fontSize: 13, fontWeight: 500, marginBottom: 14 }}>
              {pm.text}
            </div>
          )}

          {canEdit && !isAdmin && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {partStatus === null && (
                <>
                  <Btn variant="secondary" onClick={() => participate("planned")}>Планирую посетить</Btn>
                  {isFull ? (
                    <div style={{ display: "flex", alignItems: "center", fontSize: 13, color: "#DC2626", fontWeight: 500 }}>
                      Все места заняты
                    </div>
                  ) : (
                    <Btn variant="blue" onClick={() => participate("registered")}>Записаться</Btn>
                  )}
                </>
              )}
              {partStatus === "planned" && (
                <>
                  {!isFull && <Btn variant="blue" onClick={() => participate("registered")}>Записаться</Btn>}
                  <Btn variant="secondary" onClick={unparticipate}>Отменить участие</Btn>
                  {isFull && (
                    <div style={{ display: "flex", alignItems: "center", fontSize: 13, color: "#DC2626", fontWeight: 500 }}>
                      Все места заняты
                    </div>
                  )}
                </>
              )}
              {partStatus === "registered" && (
                <Btn variant="danger" onClick={unparticipate}>Отписаться</Btn>
              )}
            </div>
          )}

          {!isOwnPending && !isAdmin && event.is_finished && (
            <div style={{ fontSize: 13, color: "#9CA3AF" }}>Мероприятие завершено — участие недоступно</div>
          )}

          {isAdmin && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
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
                    {canAdminEdit && (
                      <Btn variant="primary" onClick={() => setEditing(true)}>✏️ Редактировать</Btn>
                    )}
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
                <div style={{ fontSize: 13, color: "#9CA3AF" }}>
                  Администратор может редактировать или отменить мероприятие.
                </div>
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
