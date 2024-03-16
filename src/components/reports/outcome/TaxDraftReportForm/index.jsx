import { useContext, useEffect, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { getDateString } from "../../../../utils/date";
import BankAccountsSelect from "../../../BankAccountsSelect";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";

export default function TaxDraftReportForm() {
  const [account, setAccount] = useState(null);
  const [date, setDate] = useState(getDateString());
  const { handleSubmit, setError, selected } = useContext(ReportTableContext);

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setAccount({
        value: parseInt(data.account_id),
        label: data.account,
        currency_id: parseInt(data.currency_id),
        currency: data.currency
      });
      setDate(getDateString(new Date(data.date)));
    }
  }, [selected]);

  const handleLocalSubmit = (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    let errors = [];
    try {
      if (!account) errors.push("El campo Cuenta es obligatorio.");
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
    setAccount(null);
    setDate(getDateString());
  };

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="account_id" className="form-label">
            Cuenta <span className="Required">*</span>
          </label>
          <BankAccountsSelect
            id="account"
            name="account"
            placeholder="Seleccione una cuenta"
            value={account}
            onChange={setAccount}
            onError={setError}
          />
        </div>
        <div className="col-6">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput defaultValue={selected ? new Number(selected.data.amount) : 0} currencySymbol={account?.currency} />
          <input type="hidden" name="currency_id" value={account?.currency_id || 0} />
          <input type="hidden" name="currency" value={account?.currency || ""} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="date" className="form-label">
              Fecha
          </label>
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