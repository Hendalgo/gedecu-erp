import BankAccountsSelect from "../../../BankAccountsSelect";
import { useContext, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { Form } from "react-bootstrap";
import { SessionContext } from "../../../../context/SessionContext";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";

const OtherReportForm = () => {
  const [bankAccount, setBankAccount] = useState(null);
  const [motive, setMotive] = useState("");
  const { handleSubmit, setError } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);
  const CHARS_LIMIT = 60;

  const handleMotiveChange = ({ target }) => {
    if (target.value.length <= CHARS_LIMIT) {
      setMotive(target.value);
    }
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let errors = [];

    try {
      if (!bankAccount) errors.push("El campo Cuenta es obligatorio.");
      if (formData.get("amount") === "0,00")
        errors.push("El campo Monto es obligatorio.");
      if (!formData.get("motive").trim())
        errors.push("El campo Motivo es obligatorio.");
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
    setMotive("");
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
            onError={setError}
            onChange={setBankAccount}
          />
        </div>
        <div className="col">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput currencySymbol={bankAccount?.currency} />
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
          <DateInput />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="motive" className="form-label">
            Motivo <span className="Required">*</span>
          </label>
          <textarea
            id="motive"
            name="motive"
            value={motive}
            onChange={handleMotiveChange}
            rows={5}
            className="form-control"
          ></textarea>
          <small className="">
            {motive.length} / {CHARS_LIMIT}
          </small>
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
};

export default OtherReportForm;
