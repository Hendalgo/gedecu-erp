export const useMask = (e, setValue) => {
  let input = e.target.value;
  // Elimina cualquier caracter no numérico excepto la coma
  input = input.replace(/[^0-9,]/g, "");
  // Reemplaza la coma por un punto para poder convertirlo a un número
  input = input.replace(",", ".");
  // Convierte el string a un número
  let number = parseFloat(input);
  // Comprueba si el número es válido
  if (isNaN(number)) {
    number = 0;
  }
  // Formatea el número con dos decimales y usando la coma como separador decimal y el punto para los miles
  const formattedNumber = number.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
  });
  setValue(formattedNumber);
};
export const useMaskStaless = (value) => {
  let input = value.toString();

  // Elimina cualquier caracter no numérico excepto la coma
  input = input.replace(/[^0-9,]/g, "");
  // Reemplaza la coma por un punto para poder convertirlo a un número
  input = input.replace(",", ".");
  // Convierte el string a un número
  let number = parseFloat(input);
  // Comprueba si el número es válido
  if (isNaN(number)) {
    number = 0;
  }
  // Formatea el número con dos decimales y usando la coma como separador decimal y el punto para los miles
  const formattedNumber = number.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
  });
  return formattedNumber;
};
