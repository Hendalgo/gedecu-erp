import { useContext, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import UsersSelect from "../../../UsersSelect";
import NumberInput from "../../../NumberInput";
import DecimalInput from "../../../DecimalInput";
import { SessionContext } from "../../../../context/SessionContext";

export default function DepositorOutcomeSupplierReportForm() {
  const [supplier, setSupplier] = useState(null);
  const { handleSubmit, setError, country } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    let errors = [];

    try {
      const data = new FormData(e.target);

      if (!supplier) errors.push("El campo Proveedor es obligatorio.");
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
    setSupplier(null);
  };

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset}>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="supplier_id" className="form-label">
            Proveedor <span className="Required">*</span>
          </label>
          <UsersSelect
            id="supplier"
            name="supplier"
            value={supplier}
            query={`&role=4&country=${country?.value || session.country_id}`}
            onChange={setSupplier}
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
            value={country?.currency_id || session.country.currency.id}
          />
          <input
            type="hidden"
            name="currency"
            value={country?.currency || session.country.currency.shortcode}
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
