export default function formatDate(inputDate, withDate = true) {
  const date = new Date(inputDate);

  const options = {
    hour: "2-digit",
    minute: "2-digit",
  };
  if (withDate) {
    options.day = "2-digit",
    options.year = "numeric";
    options.month = "2-digit";
  }
  const formattedTime = new Intl.DateTimeFormat("ru-uz", options)
    .format(date)
    .replace(",", " - ");

  return formattedTime;
}
