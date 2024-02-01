import DecimalInput from "../../../DecimalInput";
import { useContext } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { Form } from "react-bootstrap";
import { SessionContext } from "../../../../context/SessionContext";

const TypeTwoCashReportForm = () => {
  const { handleSubmit, setError, country } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let errors = [];

    try {
      if (formData.get("amount") === "0,00")
        errors.push("El campo Monto es obligatorio.");

      if (errors.length > 0) throw new Error(errors.join(";"));

      handleSubmit(formData);

      e.target.reset();
    } catch (error) {
      setError({
        show: true,
        message: error.message.split(";"),
        variant: "danger",
      });
    }
  };

  return (
    <form onSubmit={handleLocalSubmit} autoComplete="off">
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <DecimalInput id="amount" name="amount" />
        </div>
      </div>
      <input
        type="hidden"
        name="currency_id"
        value={country?.currency_id || session.country_id}
      />
      <input
        type="hidden"
        name="currency"
        value={country?.currency || session.country.currency.shortcode}
      />
      <div className="row mb-3">
        <div className="col-6">
          <Form.Check id="isDuplicated" name="isDuplicated" label="Duplicado" />
        </div>
      </div>
      <div className="row text-end">
        <div className="col">
          <button type="submit" className="btn btn-outline-primary">
            Agregar
          </button>
        </div>
      </div>
    </form>
  );
};

export default TypeTwoCashReportForm;
