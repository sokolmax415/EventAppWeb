import React, { useState } from "react";
import { INIT_EVENTS, USERS_BY_ROLE } from "./src/data/mockData.js";
import { EventsList } from "./src/components/events/EventsList.jsx";
import { EventDetail } from "./src/components/events/EventDetail.jsx";
import { CreateEventForm } from "./src/components/events/CreateEventForm.jsx";
import { ToastStack } from "./src/components/ui/ToastStack.jsx";

export default function App() {
  const [currentUser, setCurrentUser] = useState(USERS_BY_ROLE.student);
  const [events, setEvents] = useState(INIT_EVENTS);
  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [toasts, setToasts] = useState([]);

  const role = currentUser.role;
  const selectedEvent = events.find(e => e.id === selectedId);

  function showToast(message) {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 2600);
  }

  function handleUpdate(upd) {
    setEvents(prev => prev.map(e => e.id === upd.id ? upd : e));
    showToast(`Мероприятие «${upd.title}» обновлено`);
  }

  function handleDelete(id) {
    const event = events.find(e => e.id === id);
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: "cancelled" } : e));
    setView("list");
    if (event) showToast(`Мероприятие «${event.title}» удалено`);
  }

  function handleCreate(ev) {
    setEvents(prev => [...prev, ev]);
    setView("list");
    showToast(`Мероприятие «${ev.title}» ${ev.status === "approved" ? "создано" : "отправлено на модерацию"}`);
  }

  function handleApprove(id) {
    const event = events.find(e => e.id === id);
    setEvents(prev => prev.map(e => e.id === id ? {
      ...e,
      status: "approved",
      moderated_by: { id: currentUser.user_id, name: currentUser.name },
    } : e));
    if (event) showToast(`Мероприятие «${event.title}» одобрено`);
  }

  function handleReject(id) {
    const event = events.find(e => e.id === id);
    setEvents(prev => prev.map(e => e.id === id ? {
      ...e,
      status: "rejected",
      moderated_by: { id: currentUser.user_id, name: currentUser.name },
    } : e));
    if (event) showToast(`Мероприятие «${event.title}» отклонено`);
  }

  function handleConfirmAttendance(eventId, userId) {
    const event = events.find(e => e.id === eventId);
    const user = event?.participants?.find(participant => participant.user_id === userId);
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      const participants = (e.participants || []).map(user =>
        user.user_id === userId ? { ...user, status: "attended" } : user
      );
      return { ...e, participants };
    }));
    if (event && user) showToast(`Участие ${user.name} в мероприятии «${event.title}» подтверждено`);
  }

  function switchDemoRole(nextRole) {
    setCurrentUser(USERS_BY_ROLE[nextRole]);
    setView("list");
    setSelectedId(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ background: "#0F172A", color: "#94A3B8", padding: "8px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
        <span>🎭 Демо-режим — переключайте роли для проверки логики</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>Роль:</span>
          {["student", "admin"].map(r => (
            <button key={r} onClick={() => switchDemoRole(r)} style={{
              background: role === r ? "#fff" : "transparent",
              color: role === r ? "#0F172A" : "#94A3B8",
              border: "1px solid " + (role === r ? "#fff" : "#475569"),
              borderRadius: 6,
              padding: "3px 12px",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: role === r ? 600 : 400,
            }}>
              {r === "student" ? "Студент" : "Администратор"}
            </button>
          ))}
        </div>
      </div>

      <header style={{ background: "#fff", borderBottom: "1px solid #E5E7EB",
        padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🗓</span>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#111827", letterSpacing: "-0.3px" }}>EventHub</span>
          </div>
          <div style={{ height: 20, width: 1, background: "#E5E7EB" }} />
          <nav style={{ display: "flex", gap: 16 }}>
            <button onClick={() => setView("list")}
              style={{ background: "none", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 500,
                color: view === "list" ? "#6366F1" : "#6B7280",
                borderBottom: view === "list" ? "2px solid #6366F1" : "2px solid transparent",
                paddingBottom: 2 }}>
              Мероприятия
            </button>
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#EEF2FF",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600, color: "#4F46E5" }}>
            {role === "admin" ? "A" : "АИ"}
          </div>
          <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>
            {currentUser.name}
          </span>
          <span style={{ fontSize: 11, color: "#9CA3AF", background: "#F3F4F6",
            borderRadius: 10, padding: "2px 8px" }}>
            {role === "admin" ? "admin" : "student"}
          </span>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        {view === "list" && (
          <EventsList
            events={events}
            role={role}
            onEventClick={id => { setSelectedId(id); setView("detail"); }}
            onCreateClick={() => setView("create")}
          />
        )}
        {view === "detail" && selectedEvent && (
          <EventDetail
            event={selectedEvent}
            role={role}
            onBack={() => setView("list")}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onReject={handleReject}
            onConfirmAttendance={handleConfirmAttendance}
          />
        )}
        {view === "create" && (
          <CreateEventForm
            role={role}
            currentUser={currentUser}
            onSubmit={handleCreate}
            onCancel={() => setView("list")}
          />
        )}
      </main>

      <ToastStack toasts={toasts} />
    </div>
  );
}
