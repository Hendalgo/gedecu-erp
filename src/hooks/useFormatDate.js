export const useFormatDate = (date) => {
  let formatDate = new Date(date)
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  formatDate = formatDate.toLocaleString('es-ES', options)

  const position = formatDate.lastIndexOf(' ')
  formatDate = formatDate.slice(0, position) + ',' + formatDate.slice(position)
  return formatDate
}
