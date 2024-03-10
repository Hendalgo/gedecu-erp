import BankAccountsSelect from "../../../BankAccountsSelect";
import { useContext, useEffect, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { Form } from "react-bootstrap";
import { SessionContext } from "../../../../context/SessionContext";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";

const CreditReportForm = () => {
  const [bankAccount, setBankAccount] = useState(null);
  const [date, setDate] = useState(getDateString());
  const [duplicate, setDuplicate] = useState(false);
  const { handleSubmit, setError, selected } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setBankAccount({
        value: parseInt(data.account_id),
        label: data.account,
        currency_id: parseInt(data.currency_id),
        currency: data.currency,
      });
      setDuplicate(data.isDuplicated == "1" ? true : false);
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
      if (!bankAccount) errors.push("El campo Cuenta es obligatorio.");
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
    setBankAccount(null);
    setDate(getDateString());
    setDuplicate(false);
  };

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="account_id" className="form-label">
            Cuenta <span className="Required">*</span>
          </label>
          <BankAccountsSelect
            id="account"
            name="account"
            value={bankAccount}
            query={`${session.country.id == 2 ? `&country=${session.country.id}` : ""}`}
            onChange={setBankAccount}
            onError={setError}
          />
        </div>
        <div className="col">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput defaultValue={selected ? parseFloat(selected.data.amount) : 0} currencySymbol={bankAccount?.currency} />
        </div>
      </div>
      <input
        type="hidden"
        name="currency_id"
        value={bankAccount?.currency_id || 0}
      />
      <input
        type="hidden"
        name="currency"
        value={bankAccount?.currency || ""}
      />
      <div className="row mb-3">
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
            label="Duplicado"
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

export default CreditReportForm;
