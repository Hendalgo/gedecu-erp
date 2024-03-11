import { useContext, useEffect, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { SessionContext } from "../../../../context/SessionContext";
import StoresSelect from "../../../StoresSelect";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";

export default function DepositBoxIncomeCashReportForm() {
  const [store, setStore] = useState(null);
  const [date, setDate] = useState(getDateString());
  const { handleSubmit, setError, country, selected } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setStore({
        value: parseInt(data.store_id),
        label: data.store,
        currency_id: parseInt(data.currency_id),
        currency: data.currency,
      });
      setDate(getDateString(new Date(data.date)));
    }
  }, [selected]);

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    let errors = [];

    try {
      const formData = new FormData(e.target);

      if (!store) errors.push("El campo Local es obligatorio.");
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
    setStore(null);
    setDate(getDateString());
  };

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset}>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="store_id">
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
          <label htmlFor="amount">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput
            defaultValue={selected ? parseFloat(selected.data.amount) : 0}
            currencySymbol={store?.currency || ""}
          />
          <input
            type="hidden"
            name="currency_id"
            value={store?.currency_id || 0}
          />
          <input type="hidden" name="currency" value={store?.currency || ""} />
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
