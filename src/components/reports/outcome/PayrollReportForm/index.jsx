import { useContext, useEffect, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { getDateString } from "../../../../utils/date";
import DateInput from "../../../DateInput";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import { SessionContext } from "../../../../context/SessionContext";

export default function PayrollReportForm() {
  const [date, setDate] = useState(getDateString());
  const { handleSubmit, setError, selected } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);
  let currency = {
    id: 0, shortcode: ""
  };
  
  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setDate(getDateString(new Date(data.date)));
    }
  }, [selected]);

  const handleLocalSubmit = (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    let errors = [];
    try {
      if (formData.get("amount") == "0,00") errors.push("El campo Monto es obligatorio.");

      if (errors.length > 0) throw new Error(errors.join(";"));

      handleSubmit(formData);

      ev.target.reset();
    } catch (err) {
      setError({
        show: true,
        message: err.message.split(";"),
        variant: "danger",
      });
    }
  };

  const handleReset = () => {
    setDate(getDateString());
  };

  const { store, country } = session;

  if (store) {
    currency = {
      id: country.currency.id,
      shortcode: country.currency.shortcode,
    };
  }

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput defaultValue={selected ? new Number(selected.data.amount) : 0} currencySymbol={currency.shortcode} />
          <input type="hidden" name="currency_id" value={currency.id} />
          <input type="hidden" name="currency" value={currency.shortcode} />
        </div>
        <div className="col-6">
          <DateInput value={date} onChange={setDate} />
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
}