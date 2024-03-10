import { getDateString } from "../../utils/date";

export default function DateInput({
  name = "date",
  defaultValue = "",
  value = "",
  onChange = () => null
}) {

  const maxDate = getDateString();

  const handleChange = ({ target }) => {
    let { value } = target;

    if (!value.trim()) {
      onChange(maxDate);
    } else {
      onChange(value);
    }
  }

  return (
    <>
      <label htmlFor="date" className="form-label">
        Fecha
      </label>
      <input
        type="date"
        name={name}
        id="date"
        value={value}
        max={maxDate}
        onChange={handleChange}
        className="form-control"
      />
    </>
  );
}