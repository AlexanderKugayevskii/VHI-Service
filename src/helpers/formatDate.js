export default function formatDate(inputDate) {
  const date = new Date(inputDate);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedTime = new Intl.DateTimeFormat("ru-uz", options)
    .format(date)
    .replace(",", " - ");

  return formattedTime;
}
