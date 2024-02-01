export function formatAmount(number = 0, currency = "") {
  return `${currency ? `${currency} ` : ""}${number.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`;
}
