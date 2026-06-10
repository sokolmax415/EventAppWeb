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
  const { user, loading, signOut, refreshUser } = useAuth();
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
      console.log("Raw notifications response:", data);
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

  useEffect(() => {
  console.log("Current notifications state:", notifications);
}, [notifications]);

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

const handleUpdateProfile = async (updatedProfile) => {
  try {
    await api.updateProfile(updatedProfile);
    await refreshUser(); 
    showToast("Профиль обновлён");
  } catch (err) {
    showToast("Ошибка обновления профиля");
  }
};

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
    try {
      await api.approveEvent(id);
      const updatedEvent = await api.getEvent(id);
      setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
      if (selectedEvent?.id === id) setSelectedEvent(updatedEvent);
      if (event) showToast(`Мероприятие «${event.title}» одобрено`);
    } catch (err) {
      showToast("Ошибка одобрения");
    }
  };

  const handleReject = async (id) => {
    const event = events.find((e) => e.id === id);
    try {
      const updated = await api.rejectEvent(id);
      const updatedEvent = await api.getEvent(id);
      setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
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

  const handleRegister = async (eventId) => {
  try {
    await api.setParticipation(eventId, "registered");
    // обновляем событие в списке и выбранное событие
    const updatedEvent = await api.getEvent(eventId);
    setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
    if (selectedEvent?.id === eventId) setSelectedEvent(updatedEvent);
    showToast("Вы записались на мероприятие");
  } catch (err) {
    showToast("Ошибка записи");
  }
  };

  const handlePlan = async (eventId) => {
    try {
      await api.setParticipation(eventId, "planned");
      const updatedEvent = await api.getEvent(eventId);
      setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
      if (selectedEvent?.id === eventId) setSelectedEvent(updatedEvent);
      showToast("Вы планируете посетить мероприятие");
    } catch (err) {
      showToast("Ошибка");
    }
  };

  const handleCancelParticipation = async (eventId) => {
    try {
      await api.cancelParticipation(eventId);
      const updatedEvent = await api.getEvent(eventId);
      setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
      if (selectedEvent?.id === eventId) setSelectedEvent(updatedEvent);
      showToast("Участие отменено");
    } catch (err) {
      showToast("Ошибка отмены");
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
      <header className="app-header">
        <div className="header-left">
          <div className="brand">
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
        <div className="header-actions">
          <NotificationsDropdown
            notifications={notifications}
            onNotificationClick={handleOpenNotification}
          />
          <button
            type="button"
            className="user-menu"
            onClick={openProfile}
            style={{ border: "none", background: "transparent", cursor: "pointer" }}
          >
            <div className="avatar">
            {user.name 
              ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
              : (user.email ? user.email[0].toUpperCase() : "U")}
            </div>
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
            onUpdateProfile={handleUpdateProfile}
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
            onRegister={handleRegister}
            onPlan={handlePlan}
            onCancelParticipation={handleCancelParticipation}
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

