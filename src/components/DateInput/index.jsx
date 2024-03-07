export default function DateInput({
  name = "date"
}) {

  const maxDate = new Date().toISOString().split("T").shift();

  const handleChange = ({ target }) => {
    let { value } = target;

    if (!value.trim()) {
      target.value = maxDate;
    }
  }

  return (
    <>
      <label htmlFor="date" className="form-label">Fecha</label>
      <input type="date" name={name} id="date" defaultValue={maxDate} max={maxDate} onChange={handleChange} className="form-control" />
    </>
  );
}