import StoresSelect from "../../../StoresSelect";
import BankAccountsSelect from "../../../BankAccountsSelect";
import { useContext, useEffect, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { SessionContext } from "../../../../context/SessionContext";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";

const TypeTwoHelpReportForm = () => {
  const [store, setStore] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [date, setDate] = useState(getDateString());
  const { handleSubmit, setError, country, selected } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      const currency = country
        ? { currency_id: country.currency_id, currency: country.currency }
        : {
          currency_id: session.country.currency.id,
          currency: session.country.currency.shortcode,
        };
      setStore({
        ...currency, value: parseInt(data.store_id), label: data.store
      });
      setBankAccount({
        value: parseInt(data.account_id),
        label: data.account,
        currency_id: parseInt(data.currency_id),
        currency: data.currency,
      });
      setDate(getDateString(new Date(data.date)));
    }
  }, [selected, country]);

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let errors = [];

    try {
      if (!store) errors.push("El campo Local es obligatorio.");
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
    setStore(null);
    setBankAccount(null);
    setDate(getDateString());
  };

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="store_id" className="form-label">
            Local <span className="Required">*</span>
          </label>
          <StoresSelect
            id="store"
            name="store"
            value={store}
            query={`&not_owner=yes&country=${country?.value || session.country_id}`}
            onError={setError}
            onChange={setStore}
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
            query={`${country?.value ? `&country=${country.value}` : ""}`}
            onError={setError}
            onChange={setBankAccount}
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

export default TypeTwoHelpReportForm;
