import { useContext, useEffect } from "react";
import BankAccountsSelect from "../../../BankAccountsSelect";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { useState } from "react";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";
import { validateFields } from "../../../../utils/text";
import UsersSelect from "../../../UsersSelect";

export default function WalletBossReportForm() {
  const [account, setAccount] = useState(null);
  const [user, setUser] = useState(null);
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
      setUser({
        value: parseInt(data.user_id),
        label: data.user
      });
      setDate(getDateString(new Date(data.date)));
    }
  }, [selected]);

  const handleLocalSubmit = (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    try {
      let errors = validateFields(formData);
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
  }

  const handleReset = () => {
    setAccount(null);
    setUser(null);
    setDate(getDateString());
  }

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
            placeholder="Seleccione una cuenta"
            query="&type=2"
            value={account}
            onChange={setAccount}
            onError={setError}
          />
        </div>
        <div className="col">
          <label htmlFor="user_id" className="form-label">
            Gestor <span className="Required">*</span>
          </label>
          <UsersSelect
            id="user"
            name="user"
            placeholder="Seleccione el jefe"
            query="&role=7"
            value={user}
            onChange={setUser}
            onError={setError}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput
            defaultValue={selected ? new Number(selected.data.amount) : 0}
            currencySymbol={account?.currency}
          />
          <input
            type="hidden"
            name="currency_id"
            value={account?.currency_id || 0}
          />
          <input
            type="hidden"
            name="currency"
            value={account?.currency || ""}
          />
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
      <div className="row"></div>
    </form>
  );
}