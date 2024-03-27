export default function MotiveTextarea({ value, onChange, charLimit = 60 }) {
  const handleChange = ({ target }) => {
    if (target.value.length <= charLimit) {
      onChange(target.value);
    }
  };

  return (
    <>
      <label htmlFor="motive" className="form-label">
        Motivo <span className="Required">*</span>
      </label>
      <textarea
        name="motive"
        id="motive"
        rows="5"
        className="form-control"
        value={value}
        onChange={handleChange}
        maxLength={charLimit}
      ></textarea>
      <small className="">
        {value.length} / {charLimit}
      </small>
    </>
  );
}
