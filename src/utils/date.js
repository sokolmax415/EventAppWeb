export function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getMinDateTimeLocal() {
  const now = new Date();
  now.setSeconds(0, 0);
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
}


// Преобразует UTC из бэкенда в локальную строку для поля datetime-local (YYYY-MM-DDThh:mm)
export const utcToLocalDatetime = (utcString) => {
  if (!utcString) return "";
  const date = new Date(utcString);
  return date.toISOString().slice(0, 16);
};

// Преобразует локальную строку из поля datetime-local в UTC для отправки на бэкенд
export const localToUTC = (localDateTime) => {
  if (!localDateTime) return null;
  const date = new Date(localDateTime);
  return date.toISOString();
};