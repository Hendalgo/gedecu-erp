export function getDateString(date = new Date()) {
  return date.toISOString().split("T").shift();
}