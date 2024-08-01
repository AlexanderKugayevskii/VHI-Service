export default function formatPrice(price, withCurrency = true) {
  let formatted = `${price.toLocaleString("ru-UZ")}`;
  if (withCurrency) {
    formatted += " UZS";
  }
  return formatted;
}
