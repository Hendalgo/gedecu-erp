export const useFormatDate = (date, showTime = true) => {
  let formatDate = new Date(date);
  let options = {
    hour12: true,
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  if (showTime) {
    options = {
      ...options,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }
  }

  return formatDate.toLocaleString("es-VE", options);
};
