import UsersSelect from "../../../UsersSelect";
import BankAccountsSelect from "../../../BankAccountsSelect";
import { useContext, useEffect, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";

const SendedHelpReportForm = () => {
  const [user, setUser] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [date, setDate] = useState(getDateString());
  const { handleSubmit, setError, selected } = useContext(ReportTableContext);

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let errors = [];

    try {
      if (!user) errors.push("El campo Gestor es obligatorio.");
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

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      console.log(data)
      setUser({
        value: parseInt(data.user_id),
        label: data.user
      });
      setBankAccount({
        value: parseInt(data.account_id),
        label: data.account,
        currency_id: parseInt(data.currency_id),
        currency: data.currency,
      });
      if (data.date) {
        setDate(getDateString(new Date(data.date)));
      }
    }
  }, [selected]);

  const handleReset = () => {
    setUser(null);
    setBankAccount(null);
    setDate(getDateString());
  };

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="user_id" className="form-label">
            Gestor <span className="Required">*</span>
          </label>
          <UsersSelect
            id="user"
            name="user"
            value={user}
            query="&role=2&country=2"
            onError={setError}
            onChange={setUser}
          />
        </div>
        <div className="col">
          <label htmlFor="account_id" className="form-label">
            Cuenta <span className="Required">*</span>
          </label>
          <BankAccountsSelect
            id="account"
            name="account"
            value={bankAccount}
            onChange={setBankAccount}
            onError={setError}
            query="&country=2"
            placeholder="Selecciona la cuenta emisora"
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput defaultValue={selected ? parseFloat(selected.data.amount) : 0} currencySymbol={bankAccount?.currency} />
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
};

export default SendedHelpReportForm;
