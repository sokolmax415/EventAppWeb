import React, { useState, useEffect } from "react";
import { useAuth } from "./src/context/AuthContext";
import { api } from "./src/services/api";
import { EventsList } from "./src/components/events/EventsList.jsx";
import { EventDetail } from "./src/components/events/EventDetail.jsx";
import { CreateEventForm } from "./src/components/events/CreateEventForm.jsx";
import { ToastStack } from "./src/components/ui/ToastStack.jsx";
import ProfilePage from "./src/components/profile/ProfilePage.jsx";
import { UsersList } from "./src/components/users/UsersList.jsx";
import { NotificationsDropdown } from "./src/components/notifications/NotificationsDropdown.jsx";
import { NotificationDetailPage } from "./src/components/notifications/NotificationDetailPage.jsx";
import { LoginPage } from "./src/components/LoginPage";

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const role = user?.role;

  const selectedNotification = notifications.find((n) => n.id === selectedNotificationId);
  const currentUserNotifications = notifications.filter((n) => n.user_id === user?.user_id);

  const showToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600);
  };

  // Загрузка данных с бэкенда
  const loadEvents = async () => {
    try {
      const data = await api.getEvents();
      setEvents(data.events || []);
    } catch (err) {
      showToast("Ошибка загрузки событий");
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.warn(err);
    }
  };

  const loadUsers = async () => {
    if (role !== "admin") return;
    try {
      const data = await api.getAdminUsers();
      setUsers(data.users || []);
    } catch (err) {
      showToast("Ошибка загрузки пользователей");
    }
  };

  const loadCategories = async () => {
  try {
    const data = await api.getCategories();
    setCategories(data.categories || []);
    console.log('Categories loaded:', data);
  } catch (err) {
    console.warn('Ошибка загрузки категорий', err);
    // Заглушка, чтобы интерфейс не ломался
    setCategories([
      { id: '1', name: 'IT' },
      { id: '2', name: 'Art' },
    ]);
  }
};

  useEffect(() => {
    if (user) {
      loadEvents();
      loadNotifications();
      loadUsers();
      loadCategories();
    }
  }, [user]);

  // Обработчики действий (API)
  const handleCreate = async (eventData) => {
    try {
      const newEvent = await api.createEvent(eventData);
      setEvents((prev) => [...prev, newEvent]);
      showToast(`Мероприятие «${newEvent.title}» ${newEvent.status === "approved" ? "создано" : "отправлено на модерацию"}`);
      setView("list");
    } catch (err) {
      showToast("Ошибка создания мероприятия");
    }
  };

  function handleUpdateProfile(updatedProfile) {
  setCurrentUser((prev) => ({
    ...prev,
    ...updatedProfile,
  }));

  showToast("Профиль обновлён");
}

  const handleUpdate = async (updatedEvent) => {
    try {
      await api.updateEvent(updatedEvent.id, updatedEvent);
      setSelectedEvent(updatedEvent);
      setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
      showToast(`Мероприятие «${updatedEvent.title}» обновлено`);
    } catch (err) {
      showToast("Ошибка обновления");
    }
  };

  const handleDelete = async (id) => {
    const event = events.find((e) => e.id === id);
    try {
      await api.deleteEvent(id);
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: "cancelled" } : e)));
      setView("list");
      setSelectedId(null);
      if (event) showToast(`Мероприятие «${event.title}» удалено`);
    } catch (err) {
      showToast("Ошибка удаления");
    }
  };

  const handleApprove = async (id) => {
    const event = events.find((e) => e.id === id);
    try {
      const updated = await api.approveEvent(id);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      if (event) showToast(`Мероприятие «${event.title}» одобрено`);
    } catch (err) {
      showToast("Ошибка одобрения");
    }
  };

  const handleReject = async (id) => {
    const event = events.find((e) => e.id === id);
    try {
      const updated = await api.rejectEvent(id);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      if (event) showToast(`Мероприятие «${event.title}» отклонено`);
    } catch (err) {
      showToast("Ошибка отклонения");
    }
  };

  const handleConfirmAttendance = async (eventId, userId) => {
    try {
      await api.confirmAttendance(eventId, userId);
      const updatedEvent = await api.getEvent(eventId);
      setEvents((prev) => prev.map((e) => (e.id === eventId ? updatedEvent : e)));
      showToast("Участие подтверждено");
    } catch (err) {
      showToast("Ошибка подтверждения");
    }
  };

  const handleEventClick = async (id) => {
  try {
    const fullEvent = await api.getEvent(id);
    setSelectedEvent(fullEvent);   // сохраняем отдельно
    setView("detail");
  } catch (err) {
    showToast("Ошибка загрузки деталей");
  }
};

  const handleUserRoleChange = async (userId, nextRole) => {
    try {
      await api.changeUserRole(userId, nextRole);
      setUsers((prev) => prev.map((u) => (u.user_id === userId ? { ...u, role: nextRole } : u)));
      const changedUser = users.find((u) => u.user_id === userId);
      if (changedUser) {
        showToast(`Роль пользователя «${changedUser.name}» изменена на ${nextRole === "admin" ? "администратор" : "студент"}`);
      }
    } catch (err) {
      showToast("Ошибка изменения роли");
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenNotification = (notificationId) => {
    handleMarkNotificationRead(notificationId);
    setSelectedNotificationId(notificationId);
    setSelectedId(null);
    setView("notification-detail");
  };

  const openProfile = () => setView("profile");

  if (loading) return <div>Загрузка...</div>;
  if (!user) return <LoginPage />;

  return (
    <div className="app">
      {/* Демо-панель удалена */}
      <header className="app-header">
        <div className="header-left">
          <div className="brand">
            <span className="brand-icon">🗓</span>
            <span className="brand-name">EventHub</span>
          </div>
          <div className="header-divider" />
          <nav className="nav">
            <button
              onClick={() => { setView("list"); setSelectedId(null); }}
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
            style={{ border: "none", background: "transparent", cursor: "pointer" }}
          >
            <div className="avatar">{role === "admin" ? "A" : "АИ"}</div>
            <span className="user-name">{user.name}</span>
            <span className="role-pill">{role === "admin" ? "admin" : "student"}</span>
          </button>
          <button onClick={signOut} className="logout-button">Выйти</button>
        </div>
      </header>

      <main className="main">
        {view === "list" && (
          <EventsList
            events={events}
            role={role}
            onEventClick={async (id) => {
            try {
              const fullEvent = await api.getEvent(id);
              setSelectedEvent(fullEvent);
              setSelectedId(id);
              setView("detail");
            } catch (err) {
              showToast("Ошибка загрузки деталей мероприятия");
            }
          }}
            onCreateClick={() => setView("create")}
          />
        )}
        {view === "profile" && (
          <ProfilePage
            currentUser={user}
            events={events}
            achievements={[]}  // Достижения загружаются внутри ProfilePage
          />
        )}
        {view === "notification-detail" && selectedNotification && (
          <NotificationDetailPage
            notification={selectedNotification}
            onBack={() => { setView("list"); setSelectedNotificationId(null); }}
          />
        )}
        {view === "detail" && selectedEvent && (
          <EventDetail
            event={selectedEvent}
            role={role}
            currentUser={user} 
            categories={categories}
            onBack={() => { setView("list"); setSelectedId(null); }}
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
            categories={categories}
            currentUser={user}
            onSubmit={handleCreate}
            onCancel={() => setView("list")}
          />
        )}
        {view === "users" && role === "admin" && (
          <UsersList
            users={users}
            currentUserId={user.user_id}
            onRoleChange={handleUserRoleChange}
          />
        )}
      </main>
      <ToastStack toasts={toasts} />
    </div>
  );
}

