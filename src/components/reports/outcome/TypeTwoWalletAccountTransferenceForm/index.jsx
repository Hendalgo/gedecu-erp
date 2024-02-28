import { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import BankAccountsSelect from "../../../BankAccountsSelect";
import AmountCurrencyInput from "../../../AmountCurrencyInput";

export default function TypeTwoWalletAccountTransferenceForm() {
  // Reporte 2 > Egreso > Cuenta Billetera Transferencia
  const [account, setAccount] = useState(null);
  const { handleSubmit, setError } = useContext(ReportTableContext);

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    let errors = [];

    const data = new FormData(e.target);

    try {
      if (!account) errors.push("El campo Cuenta es obligatorio.");
      if (data.get("amount") === "0,00")
        errors.push("El campo Monto es obligatorio.");

      if (errors.length > 0) throw new Error(errors.join(";"));

      handleSubmit(data);

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
    setAccount(null);
  };

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset}>
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="account_id" className="form-label">
            Cuenta <span className="Required">*</span>
          </label>
          <BankAccountsSelect
            id="account"
            name="account"
            value={account}
            onChange={setAccount}
            query="&type=2"
          />
        </div>
        <div className="col-6">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput currencySymbol={account?.currency || ""} />
        </div>
        <input
          type="hidden"
          name="currency_id"
          value={account?.currency_id || 0}
        />
        <input type="hidden" name="currency" value={account?.currency || ""} />
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <Form.Check
            id="isDuplicated"
            name="isDuplicated"
            label={`Duplicado`}
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
}
