import BankAccountsSelect from "../../../BankAccountsSelect";
import UsersSelect from "../../../UsersSelect";
import { useContext, useEffect, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";

const SupplierReportForm = () => {
  const [user, setUser] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(getDateString());
  const { handleSubmit, setError, selected } = useContext(ReportTableContext);

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setUser({
        value: parseInt(data.supplier_id),
        label: data.supplier,
      });
      setBankAccount({
        value: parseInt(data.account_id),
        label: data.account,
        currency_id: data.currency_id,
        currency: data.currency,
      });
      setReference(data.reference);

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
      if (!user) errors.push("El campo Proveedor es obligatorio.");
      if (!bankAccount) errors.push("El campo Cuenta es obligatorio.");
      if (formData.get("amount") === "0,00")
        errors.push("El campo Monto es obligatorio.");
      if (!formData.get("reference").trim())
        errors.push("El campo Referencia es obligatorio.");
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
    setUser(null);
    setBankAccount(null);
    setReference("");
    setDate(getDateString());
  };

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="supplier_id" className="form-label">
            Proveedor <span className="Required">*</span>
          </label>
          <UsersSelect
            id="supplier"
            name="supplier"
            value={user}
            onChange={setUser}
            onError={setError}
            placeholder="Selecciona al proveedor"
            query="&role=4"
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
            placeholder="Selecciona la cuenta receptora"
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
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
        <div className="col">
          <label htmlFor="reference" className="form-label">
            Referencia <span className="Required">*</span>
          </label>
          <input
            type="text"
            id="reference"
            name="reference"
            value={reference}
            onChange={({target}) => setReference(target.value)}
            maxLength={20}
            className="form-control"
          />
        </div>
      </div>
      <div className="row mb-3">
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

export default SupplierReportForm;
