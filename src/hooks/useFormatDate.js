export const useFormatDate = (date) => {
  let formatDate = new Date(date);
  const options = {
    hour12: true,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  return formatDate.toLocaleString("es-VE", options);
};
