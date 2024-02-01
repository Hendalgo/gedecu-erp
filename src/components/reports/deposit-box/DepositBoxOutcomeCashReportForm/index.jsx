import { useContext, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { SessionContext } from "../../../../context/SessionContext";
import StoresSelect from "../../../StoresSelect";
import DecimalInput from "../../../DecimalInput";
import { Form } from "react-bootstrap";
import NumberInput from "../../../NumberInput";

export default function DepositBoxOutcomeCashReportForm() {
  const [store, setStore] = useState(null);
  const { handleSubmit, setError, country } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    let errors = [];

    try {
      const data = new FormData(e.target);

      if (!store) errors.push("El campo Local es obligatorio.");
      if (data.get("deposits_quantity") == 0)
        errors.push("El campo Cantidad de depósitos es obligatorio.");
      if (data.get("amount") == "0,00")
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
    setStore(null);
  };

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset}>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="store_id" className="form-label">
            Local <span className="Required">*</span>
          </label>
          <StoresSelect
            id="store"
            name="store"
            value={store}
            query={`&country=${country?.value || session.country_id}`}
            onChange={setStore}
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
          <DecimalInput id="amount" name="amount" />
          <input
            type="hidden"
            name="currency_id"
            value={store?.currency_id || 0}
          />
          <input type="hidden" name="currency" value={store?.currency || ""} />
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
