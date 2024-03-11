import { useContext, useEffect, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { SessionContext } from "../../../../context/SessionContext";
import UsersSelect from "../../../UsersSelect";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";

export default function DepositBoxOutcomeDeliveryReportForm() {
  const [supplier, setSupplier] = useState(null);
  const [date, setDate] = useState(getDateString());
  const { handleSubmit, setError, country, selected } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setSupplier({
        value: parseInt(data.supplier_id),
        label: data.supplier,
      });
      setDate(getDateString(new Date(data.date)));
    }
  }, [selected]);

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    let errors = [];

    try {
      const formData = new FormData(e.target);

      if (!supplier) errors.push("El campo Proveedor es obligatorio.");
      if (formData.get("amount") == "0,00")
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
    setSupplier(null);
    setDate(getDateString());
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
        <div className="col-6">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput
            defaultValue={selected ? parseFloat(selected.data.amount) : 0}
            currencySymbol={
              country?.currency || session.country.currency.shortcode
            }
          />
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
      <div className="row mb-3">
        <div className="col-6">
          <DateInput value={date} onChange={setDate} />
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
