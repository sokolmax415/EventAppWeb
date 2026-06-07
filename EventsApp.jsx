import React, { useState } from "react";

import { INIT_EVENTS, USERS_BY_ROLE, MOCK_ACHIEVEMENTS, INIT_USERS, MOCK_NOTIFICATIONS } from "./src/data/mockData.js";
import { EventsList } from "./src/components/events/EventsList.jsx";
import { EventDetail } from "./src/components/events/EventDetail.jsx";
import { CreateEventForm } from "./src/components/events/CreateEventForm.jsx";
import { ToastStack } from "./src/components/ui/ToastStack.jsx";
import ProfilePage from "./src/components/profile/ProfilePage.jsx";
import { UsersList } from "./src/components/users/UsersList.jsx";
import { NotificationsDropdown } from "./src/components/notifications/NotificationsDropdown.jsx";
import { NotificationDetailPage } from "./src/components/notifications/NotificationDetailPage.jsx";

export default function App() {
  const [currentUser, setCurrentUser] = useState(USERS_BY_ROLE.student);
  const [events, setEvents] = useState(INIT_EVENTS);
  const [users, setUsers] = useState(INIT_USERS);
  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);

  const role = currentUser.role;
  const selectedEvent = events.find((event) => event.id === selectedId);
 
const currentUserNotifications = notifications.filter(
  (notification) => notification.user_id === currentUser.user_id
);

const selectedNotification = notifications.find(
  (notification) => notification.id === selectedNotificationId
);
function handleOpenNotification(notificationId) {
  setNotifications((prev) =>
    prev.map((notification) =>
      notification.id === notificationId
        ? { ...notification, is_read: true }
        : notification
    )
  );

  setSelectedNotificationId(notificationId);
  setSelectedId(null);
  setView("notification-detail");
}
function switchDemoRole(nextRole) {
  setCurrentUser(USERS_BY_ROLE[nextRole]);
  setView("list");
  setSelectedId(null);
  setSelectedNotificationId(null);
}


  function showToast(message) {
    const id = Date.now() + Math.random();

    setToasts((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2600);
  }

  function handleUpdate(upd) {
    setEvents((prev) => prev.map((event) => (event.id === upd.id ? upd : event)));
    showToast(`Мероприятие «${upd.title}» обновлено`);
  }

  function handleDelete(id) {
    const event = events.find((event) => event.id === id);

    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, status: "cancelled" } : event
      )
    );

    setView("list");
    setSelectedId(null);

    if (event) {
      showToast(`Мероприятие «${event.title}» удалено`);
    }
  }

  function handleCreate(ev) {
    setEvents((prev) => [...prev, ev]);
    setView("list");

    showToast(
      `Мероприятие «${ev.title}» ${
        ev.status === "approved" ? "создано" : "отправлено на модерацию"
      }`
    );
  }

  function handleApprove(id) {
    const event = events.find((event) => event.id === id);

    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? {
              ...event,
              status: "approved",
              moderated_by: {
                id: currentUser.user_id,
                name: currentUser.name,
              },
            }
          : event
      )
    );

    if (event) {
      showToast(`Мероприятие «${event.title}» одобрено`);
    }
  }

  function handleReject(id) {
    const event = events.find((event) => event.id === id);

    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? {
              ...event,
              status: "rejected",
              moderated_by: {
                id: currentUser.user_id,
                name: currentUser.name,
              },
            }
          : event
      )
    );

    if (event) {
      showToast(`Мероприятие «${event.title}» отклонено`);
    }
  }

  function handleConfirmAttendance(eventId, userId) {
    const event = events.find((event) => event.id === eventId);
    const user = event?.participants?.find(
      (participant) => participant.user_id === userId
    );

    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event;

        const participants = (event.participants || []).map((participant) =>
          participant.user_id === userId
            ? { ...participant, status: "attended" }
            : participant
        );

        return { ...event, participants };
      })
    );

    if (event && user) {
      showToast(
        `Участие ${user.name} в мероприятии «${event.title}» подтверждено`
      );
    }
  }

  function handleUserRoleChange(userId, nextRole) {
    const user = users.find(item => item.user_id === userId);
    setUsers(prev => prev.map(item =>
      item.user_id === userId ? { ...item, role: nextRole } : item
    ));
    if (user) {
      showToast(`Роль пользователя «${user.name}» изменена на ${nextRole === "admin" ? "администратор" : "студент"}`);
    }
  }

  function switchDemoRole(nextRole) {
    setCurrentUser(USERS_BY_ROLE[nextRole]);
    setView(nextRole === "admin" ? view : "list");
    setSelectedId(null);
  }

  function openProfile() {
    setView("profile");
    setSelectedId(null);
  }

  return (
    <div className="app">
      <div className="demo-bar">
        <span>🎭 Демо-режим — переключайте роли для проверки логики</span>

        <div className="role-switcher">
          <span>Роль:</span>

          {["student", "admin"].map((roleName) => (
            <button
              key={roleName}
              onClick={() => switchDemoRole(roleName)}
              className={`role-button${role === roleName ? " is-active" : ""}`}
            >
              {roleName === "student" ? "Студент" : "Администратор"}
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
              onClick={() => {
                setView("list");
                setSelectedId(null);
              }}
              className={`nav-button${view === "list" ? " is-active" : ""}`}
            >
              Мероприятия
            </button>
            <button
              onClick={openProfile}
              className={`nav-button${view === "profile" ? " is-active" : ""}`}
            >
              Профиль
            </button>
            {role === "admin" && (
              <button
                onClick={() => setView("users")}
                className={`nav-button${view === "users" ? " is-active" : ""}`}
              >
                Пользователи
              </button>
            )}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

  <NotificationsDropdown
  notifications={currentUserNotifications}
  onNotificationClick={handleOpenNotification}
/>

        <button
          type="button"
          className="user-menu"
          onClick={openProfile}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <div className="avatar">{role === "admin" ? "A" : "АИ"}</div>

          <span className="user-name">{currentUser.name}</span>

          <span className="role-pill">
            {role === "admin" ? "admin" : "student"}
          </span>
        </button>
        </div>
      </header>
      

      <main className="main">
        {view === "list" && (
          <EventsList
            events={events}
            role={role}
            onEventClick={(id) => {
              setSelectedId(id);
              setView("detail");
            }}
            onCreateClick={() => setView("create")}
          />
        )}

        {view === "profile" && (
  <ProfilePage
    currentUser={currentUser}
    events={events}
    achievements={MOCK_ACHIEVEMENTS}
  />
)
}
{view === "notification-detail" && (
  <NotificationDetailPage
    notification={selectedNotification}
    onBack={() => {
      setView("list");
      setSelectedNotificationId(null);
    }}
  />
)}

        {view === "detail" && selectedEvent && (
          <EventDetail
            event={selectedEvent}
            role={role}
            onBack={() => {
              setView("list");
              setSelectedId(null);
            }}
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
        {view === "users" && role === "admin" && (
          <UsersList
            users={users}
            currentUserId={currentUser.user_id}
            onRoleChange={handleUserRoleChange}
          />
        )}
      </main>

      <ToastStack toasts={toasts} />
    </div>
  );
}