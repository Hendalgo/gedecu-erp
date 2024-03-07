import { useContext } from "react";
import { Form } from "react-bootstrap";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { SessionContext } from "../../../../context/SessionContext";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";

const TypeTwoWalletAccountReportForm = () => {
  // Reporte 2 > Egreso > Cuenta Billetera Efectivo
  const { handleSubmit, setError, country } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    let errors = [];

    const formData = new FormData(e.target);

    try {
      if (formData.get("amount") === "0,00")
        errors.push("El campo Monto es obligatorio.");
      if (formData.get("date")) {
        const now = new Date(formData.get("date")).getTime();
        if (now > new Date().getTime()) {
          errors.push("La fecha es inválida.");
        }
      }
  
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
    <form onSubmit={handleLocalSubmit}>
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput currencySymbol={country?.currency || session.country.currency.shortcode} />
        </div>
        <input
          type="hidden"
          name="currency_id"
          value={country?.currency_id || session.country.currency.id}
        />
        <input
          type="hidden"
          name="currency"
          value={country?.currency || session.country.currency.shortcode}
        />
        <div className="col-6">
          <DateInput />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <Form.Check
            id="isDuplicated"
            name="isDuplicated"
            label={`Duplicado`}
          />
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

export default TypeTwoWalletAccountReportForm;
