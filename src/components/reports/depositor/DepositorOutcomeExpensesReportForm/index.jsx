import { useContext, useEffect, useState } from "react";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import MotiveTextarea from "../../../MotiveTextarea";
import { getDateString } from "../../../../utils/date";
import { validateFields } from "../../../../utils/text";
import { SessionContext } from "../../../../context/SessionContext";
import { ReportTableContext } from "../../../../context/ReportTableContext";

export default function DepositorOutcomeExpensesReportForm() {
  const [date, setDate] = useState(getDateString());
  const [motive, setMotive] = useState("");
  const { session } = useContext(SessionContext);
  const { handleSubmit, setError, selected } = useContext(ReportTableContext);
  const { currency } = session.country;

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setMotive(data.motive);
      if (data.date) {
        setDate(getDateString(new Date(data.date)));
      }
    }
  }, [selected]);

  const handleLocalSubmit = (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    let errors = [];

    try {
      errors = validateFields(formData);

      if (errors.length > 0) throw new Error(errors.join(";"));

      handleSubmit(formData);

      ev.target.reset();
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
    setMotive("");
  };

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset}>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput
            defaultValue={selected ? parseFloat(selected.data.amount) : 0}
            currencySymbol={currency.shortcode}
          />
          <input type="hidden" name="currency_id" value={currency.id} />
          <input type="hidden" name="currency" value={currency.shortcode} />
        </div>
        <div className="col-6">
          <DateInput value={date} onChange={setDate} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <MotiveTextarea value={motive} onChange={setMotive} />
        </div>
      </div>
      <div className="row">
        <div className="col text-end">
          <input
            type="submit"
            value="Agregar"
            className="btn btn-outline-primary"
          />
        </div>
      </div>
    </form>
  );
}
