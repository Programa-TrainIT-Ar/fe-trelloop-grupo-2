function truncateDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatToDDMMYYYY(date: Date | null) {
  if (!date) return "";
  const año = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${dia}-${mes}-${año}`;
}
export { truncateDate, formatToDDMMYYYY };