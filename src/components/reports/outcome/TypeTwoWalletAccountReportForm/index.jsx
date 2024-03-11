import { useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { SessionContext } from "../../../../context/SessionContext";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";

const TypeTwoWalletAccountReportForm = () => {
  // Reporte 2 > Egreso > Cuenta Billetera Efectivo
  const [date, setDate] = useState(getDateString());
  const [duplicate, setDuplicate] = useState(false);
  const { handleSubmit, setError, country, selected } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setDate(getDateString(new Date(data.date)));
      setDuplicate(data.isDuplicated == "1" ? true : false);
    }
  }, [selected]);

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

  const handleReset = () => {
    setDate(getDateString());
    setDuplicate(false);
  }
  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput
            defaultValue={selected ? parseFloat(selected.data.amount) : 0}
            currencySymbol={
              country?.currency || session.country.currency.shortcode
            }
          />
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
          <DateInput value={date} onChange={setDate} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <Form.Check
            checked={duplicate}
            onChange={() => setDuplicate((prev) => !prev)}
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
