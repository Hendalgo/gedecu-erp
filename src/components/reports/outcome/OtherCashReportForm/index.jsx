import { useContext, useEffect, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { Form } from "react-bootstrap";
import { SessionContext } from "../../../../context/SessionContext";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";
import MotiveTextarea from "../../../MotiveTextarea";
import { validateFields } from "../../../../utils/text";

export default function OtherCashReportForm() {
  const [date, setDate] = useState(getDateString());
  const [motive, setMotive] = useState("");
  const { handleSubmit, setError, selected } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);
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

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let errors = [];

    try {
      errors = validateFields(formData);

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
    setMotive("");
    setDate(getDateString());
  };

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
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
}
