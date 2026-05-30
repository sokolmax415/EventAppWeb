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
    <div className="app">
      <div className="demo-bar">
        <span>🎭 Демо-режим — переключайте роли для проверки логики</span>
        <div className="role-switcher">
          <span>Роль:</span>
          {["student", "admin"].map(r => (
            <button
              key={r}
              onClick={() => switchDemoRole(r)}
              className={`role-button${role === r ? " is-active" : ""}`}
            >
              {r === "student" ? "Студент" : "Администратор"}
            </button>
          ))}
        </div>
      </div>

      <header className="app-header">
        <div className="header-left">
          <div className="brand">
            <span className="brand-icon">🗓</span>
            <span className="brand-name">EventHub</span>
          </div>
          <div className="header-divider" />
          <nav className="nav">
            <button
              onClick={() => setView("list")}
              className={`nav-button${view === "list" ? " is-active" : ""}`}
            >
              Мероприятия
            </button>
          </nav>
        </div>
        <div className="user-menu">
          <div className="avatar">
            {role === "admin" ? "A" : "АИ"}
          </div>
          <span className="user-name">
            {currentUser.name}
          </span>
          <span className="role-pill">
            {role === "admin" ? "admin" : "student"}
          </span>
        </div>
      </header>

      <main className="main">
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
