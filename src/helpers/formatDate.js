export default function formatDate(
  inputDate,
  settings = { withHours: true, withDate: true, separator: "-" }
) {
  const date = new Date(inputDate);

  const options = {};

  if (settings.withHours) {
    (options.hour = "2-digit"), (options.minute = "2-digit");
  }
  if (settings.withDate) {
    (options.day = "2-digit"), (options.year = "numeric");
    options.month = "2-digit";
  }
  const formattedTime = new Intl.DateTimeFormat("ru-uz", options)
    .format(date)
    .replace(/[,\.]/g, "-");

  return formattedTime;
}
