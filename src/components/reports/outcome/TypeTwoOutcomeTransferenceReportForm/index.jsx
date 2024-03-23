import { useContext, useEffect, useState } from "react";
import UsersSelect from "../../../UsersSelect";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { Form } from "react-bootstrap";
import BankAccountsSelect from "../../../BankAccountsSelect";
import { SessionContext } from "../../../../context/SessionContext";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";

const TypeTwoOutcomeTransferenceReportForm = () => {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(getDateString());
  const [duplicate, setDuplicate] = useState(false);
  const { handleSubmit, setError, selected } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setAccount({
        value: parseInt(data.account_id),
        label: data.account,
        currency_id: parseInt(0),
        currency: "",
      });
      setUser({
        value: parseInt(data.user_id),
        label: data.user,
      });
      setAmount(new Number(data.amount));
      setDate(getDateString(new Date(data.date)));
      setDuplicate(data.isDuplicated == "1" ? true : false);
    }
  }, [selected]);

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let errors = [];

    try {
      if (!user) errors.push("El campo Gestor es obligatorio.");
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
    setUser(null);
    setAccount(null);
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
            value={account}
            onChange={setAccount}
            onError={setError}
            query="&type=1"
          />
        </div>
        <div className="col">
          <label htmlFor="user_id" className="form-label">
            Gestor <span className="Required">*</span>
          </label>
          <UsersSelect
            id="user"
            name="user"
            value={user}
            onChange={setUser}
            onError={setError}
            query="&role=7"
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput
            defaultValue={amount}
            currencySymbol={session.country.currency.shortcode}
            onChange={setAmount}
          />
        </div>
        <input
          type="hidden"
          name="currency_id"
          value={session.country.currency.id}
        />
        <input
          type="hidden"
          name="currency"
          value={session.country.currency.shortcode}
        />
        <div className="col-6">
          <DateInput value={date} onChange={setDate} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <Form.Check
            checked={duplicate}
            onChange={() => setDuplicate((prev) => !prev)}
            type="checkbox"
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

export default TypeTwoOutcomeTransferenceReportForm;
