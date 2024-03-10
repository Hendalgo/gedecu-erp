export function formatField(value, key) {
  let formated = value.trim();

  if (["amount", "rate", "conversion"].includes(key)) {
    formated = parseFloat(value.replace(/[.,]/gi, "")) / 100;
  }
  if (["transferences_quantity", "deposits_quantity"].includes(key)) {
    formated = parseInt(value);
  }
  if (key.includes("date")) {
    if (value.trim()) formated = new Date(value).toISOString();
  }
  return formated;
}