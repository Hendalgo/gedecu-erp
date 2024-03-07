import { useContext, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import BankAccountsSelect from "../../../BankAccountsSelect";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";

const TypeTwoIncomeTransferenceReportForm = () => {
  const [bankAccount, setBankAccount] = useState(null);
  const { handleSubmit, setError, country } = useContext(ReportTableContext);

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
            query={`&type=1${country?.value ? `&country=${country.value}` : ""}`}
            onChange={setBankAccount}
            onError={setError}
          />
        </div>
        <div className="col">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput currencySymbol={bankAccount?.currency} />
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
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <DateInput />
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

export default TypeTwoIncomeTransferenceReportForm;
