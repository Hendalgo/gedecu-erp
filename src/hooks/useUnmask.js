export function useUnmask (masked) {
  function isNumeric (char) {
    return !isNaN(char - parseFloat(char))
  }

  let unmasked = ''
  for (let i = 0; i < masked.length; i++) {
    if (isNumeric(masked[i]) || masked[i] === ',') {
      unmasked += masked[i]
    }
  }
  unmasked = unmasked.replace(',', '.')
  return parseFloat(unmasked)
}

function isNumeric (char) {
  return !isNaN(char - parseInt(char))
}
