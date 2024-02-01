import { useContext, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import UsersSelect from "../../../UsersSelect";
import DecimalInput from "../../../DecimalInput";
import NumberInput from "../../../NumberInput";
import { Form } from "react-bootstrap";
import { SessionContext } from "../../../../context/SessionContext";

export default function DepositorOutcomeWalletReportForm() {
  const [user, setUser] = useState(null);
  const { handleSubmit, setError, country } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    let errors = [];

    try {
      const data = new FormData(e.target);

      if (!user) errors.push("El campo Gestor es obligatorio.");
      if (data.get("deposits_quantity") == 0)
        errors.push("El campo Cantidad de depósitos es obligatorio.");
      if (data.get("amount") == "0,00")
        errors.push("El campo Monto es obligatorio.");
      if (data.get("rate") == "0,00")
        errors.push("El campo Tasa es obligatorio.");

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
    setUser(null);
    setAmount(0);
    setRate(0);
  };

  const handleAmount = (value) => {
    setAmount(value);
  };
  const handleRate = (value) => {
    setRate(value);
  };

  const conversion = (amount * rate).toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset}>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="user_id" className="form-label">
            Gestor <span className="Required">*</span>
          </label>
          <UsersSelect
            id="user"
            name="user"
            value={user}
            query={`&role=3&country=${country?.value || session.country_id}`}
            onChange={setUser}
            onError={setError}
          />
        </div>
        <div className="col">
          <label htmlFor="deposits_quantity" className="form-label">
            Cantidad de depósitos <span className="Required">*</span>
          </label>
          <NumberInput id="deposits_quantity" name="deposits_quantity" />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <DecimalInput id="amount" name="amount" onChange={handleAmount} />
          <input type="hidden" name="currency_id" value={3} />
          <input type="hidden" name="currency" value="USD" />
        </div>
        <div className="col-6">
          <label htmlFor="rate" className="form-label">
            Tasa <span className="Required">*</span>
          </label>
          <DecimalInput id="rate" name="rate" onChange={handleRate} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="conversion" className="form-label">
            Conversión
          </label>
          <input
            type="text"
            name="conversion"
            id="conversion"
            value={conversion}
            readOnly
            className="form-control"
          />
          <input
            type="hidden"
            name="conversionCurrency_id"
            value={country?.currency_id || session.country.currency.id}
          />
          <input
            type="hidden"
            name="conversionCurrency"
            value={country?.currency || session.country.currency.shortcode}
          />
          <input type="hidden" name="convert_amount" defaultValue={true} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <Form.Check
            type="checkbox"
            id="isDuplicated"
            name="isDuplicated"
            label="Duplicado"
          />
        </div>
      </div>
      <div className="row">
        <div className="col text-end">
          <input
            type="submit"
            value="Agregar"
            className="btn btn-outline-primary"
          />
        </div>
      </div>
    </form>
  );
}
