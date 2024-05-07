export default function formatNumber(num) {
  const formattedNumber =
    num.slice(0, 2) +
    " " +
    num.slice(2, 5) +
    " " +
    num.slice(5, 7) +
    " " +
    num.slice(7, 9) +
    " " +
    num.slice(9);

  return formattedNumber;
}
