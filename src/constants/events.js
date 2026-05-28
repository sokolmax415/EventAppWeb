export const CATEGORIES = ["IT", "Frontend", "Backend", "Data Science", "Design", "Security", "DevOps", "Mobile"];

export const STATUS = {
  pending: { label: "На модерации", bg: "#FEF3C7", color: "#92400E", border: "#FCD34D" },
  approved: { label: "Одобрено", bg: "#D1FAE5", color: "#064E3B", border: "#6EE7B7" },
  rejected: { label: "Отклонено", bg: "#FEE2E2", color: "#7F1D1D", border: "#FCA5A5" },
  cancelled: { label: "Отменено", bg: "#F3F4F6", color: "#6B7280", border: "#D1D5DB" },
  finished: { label: "Завершено", bg: "#F3F4F6", color: "#9CA3AF", border: "#D1D5DB" },
};

export const PART_MSG = {
  registered: { text: "Вы записаны на мероприятие", bg: "#EFF6FF", color: "#1E40AF" },
  planned: { text: "Вы планируете посетить мероприятие", bg: "#F5F3FF", color: "#3730A3" },
  attended: { text: "Мероприятие посещено ✓", bg: "#F0FDF4", color: "#14532D" },
};
