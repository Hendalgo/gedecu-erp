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

export function validateFields(formData = new FormData()) {
  let errors = [];

  if (formData.has("account") && !formData.get("account"))
    errors.push("El campo Cuenta es obligatorio.");

  if (formData.has("wallet") && !formData.get("wallet"))
    errors.push("El campo Billetera es obligatorio.");

  if (formData.has("user") && !formData.get("user"))
    errors.push("El campo Gestor es obligatorio.");

  if (formData.get("amount") == "0,00")
    errors.push("El campo Monto es obligatorio.");

  if (formData.has("rate") && formData.get("rate") == "0,00")
    errors.push("El campo Tasa es obligatorio.");

  if (formData.has("motive") && !formData.get("motive").trim())
    errors.push("El campo Motivo es obligatorio.");

  const date = new Date(formData.get("date"));
  if (date.getTime() > Date.now()) {
    errors.push("La fecha es inválida.");
  }

  return errors;
}
