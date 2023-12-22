export const useFormatDate = (date) => {
  let formatDate = new Date(date)
  const options = { hour12: true, day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }
  formatDate = formatDate.toLocaleString('es-ES', options)

  const position = formatDate.lastIndexOf(' ')
  formatDate = formatDate.slice(0, position) + ',' + formatDate.slice(position)
  return formatDate
}
