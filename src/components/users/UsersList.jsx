import React, { useState } from "react";
import { USER_ROLE } from "../../constants/users.js";
import { Btn } from "../ui/Button.jsx";
import { ConfirmDialog } from "../ui/ConfirmDialog.jsx";

export function UsersList({ users, currentUserId, onRoleChange }) {
  const adminsCount = users.filter(user => user.role === "admin").length;
  const [pendingRoleChange, setPendingRoleChange] = useState(null);

  function requestRoleChange(user, nextRole) {
    setPendingRoleChange({ user, nextRole });
  }

  function confirmRoleChange() {
    if (!pendingRoleChange) return;
    onRoleChange(pendingRoleChange.user.user_id, pendingRoleChange.nextRole);
    setPendingRoleChange(null);
  }

  const confirmation = pendingRoleChange
    ? getRoleChangeConfirmation(pendingRoleChange.user, pendingRoleChange.nextRole)
    : null;

  return (
    <div>
      <div className="page-heading-row">
        <div>
          <h1 className="page-title">Пользователи</h1>
          <p className="page-subtitle">
            {users.length} пользователей
          </p>
        </div>
      </div>

      <div className="users-grid">
        {users.map(user => {
          const roleMeta = USER_ROLE[user.role];
          const isCurrentUser = user.user_id === currentUserId;
          const isLastAdmin = user.role === "admin" && adminsCount === 1;
          const roleChangeDisabled = isCurrentUser || isLastAdmin;

          return (
            <article key={user.user_id} className="user-card">
              <div className="user-card-head">
                <div className="user-card-main">
                <div className="user-card-avatar">
                  {getInitials(user.name)}
                </div>
                <div>
                  <h2 className="user-card-name">{user.name}</h2>
                </div>
              </div>
                <span
                  className="user-role-badge"
                  style={{
                    "--user-role-bg": roleMeta.bg,
                    "--user-role-color": roleMeta.color,
                    "--user-role-border": roleMeta.border,
                  }}
                >
                  {roleMeta.label}
                </span>
              </div>

              <div className="user-card-info">
                <div>
                  <div className="field-label">ID пользователя</div>
                  <div className="field-value">{user.user_id}</div>
                </div>
                <div>
                  <div className="field-label">Email</div>
                  <div className="field-value">{user.email}</div>
                </div>
              </div>

              <div className="user-role-actions">
                <Btn
                  variant={user.role === "student" ? "blue" : "secondary"}
                  disabled={roleChangeDisabled || user.role === "student"}
                  onClick={() => requestRoleChange(user, "student")}
                >
                  Студент
                </Btn>
                <Btn
                  variant={user.role === "admin" ? "blue" : "secondary"}
                  disabled={roleChangeDisabled || user.role === "admin"}
                  onClick={() => requestRoleChange(user, "admin")}
                >
                  Администратор
                </Btn>
              </div>

              {roleChangeDisabled && (
                <div className="muted-note">
                  {isCurrentUser
                    ? "Свою роль нельзя изменить!"
                    : "Нельзя убрать последнего администратора!"}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {confirmation && (
        <ConfirmDialog
          title={confirmation.title}
          message={confirmation.message}
          confirmLabel={confirmation.confirmLabel}
          confirmVariant={confirmation.confirmVariant}
          onConfirm={confirmRoleChange}
          onCancel={() => setPendingRoleChange(null)}
        />
      )}
    </div>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();
}

function getRoleChangeConfirmation(user, nextRole) {
  if (nextRole === "admin") {
    return {
      title: "Назначить администратора?",
      message: `Вы действительно хотите предоставить пользователю «${user.name}» права администратора? Он сможет модерировать мероприятия и изменять роли пользователей.`,
      confirmLabel: "Назначить",
      confirmVariant: "success",
    };
  }

  return {
    title: "Понизить до студента?",
    message: `Вы действительно хотите уменьшить права пользователя «${user.name}» до роли студента? Он потеряет доступ к административным разделам.`,
    confirmLabel: "Понизить",
    confirmVariant: "dangerSolid",
  };
}
