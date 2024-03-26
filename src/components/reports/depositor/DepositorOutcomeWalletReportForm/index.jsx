import { useContext, useEffect, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import UsersSelect from "../../../UsersSelect";
import NumberInput from "../../../NumberInput";
import { Form } from "react-bootstrap";
import { SessionContext } from "../../../../context/SessionContext";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";

export default function DepositorOutcomeWalletReportForm() {
  const [user, setUser] = useState(null);
  const { handleSubmit, setError, country, selected } =
    useContext(ReportTableContext);
  const { session } = useContext(SessionContext);
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(getDateString());
  const [duplicate, setDuplicate] = useState(false);
  const { currency } = session.country;

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setUser({
        value: parseInt(data.user_id),
        label: data.user,
      });
      setAmount(parseFloat(data.amount));
      setDate(getDateString(new Date(data.date)));
      setDuplicate(data.isDuplicated == "1" ? true : false);
    }
  }, [selected]);

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    let errors = [];

    try {
      const formData = new FormData(e.target);

      if (!user) errors.push("El campo Gestor es obligatorio.");
      if (formData.get("deposits_quantity") == 0)
        errors.push("El campo Cantidad de depósitos es obligatorio.");
      if (formData.get("amount") == "0,00")
        errors.push("El campo Monto es obligatorio.");
      if (formData.get("rate") == "0,00")
        errors.push("El campo Tasa es obligatorio.");
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
    setAmount(0);
    setDate(getDateString());
    setDuplicate(false);
  };

  const handleAmount = (value) => {
    setAmount(value);
  };

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
          <NumberInput
            defaultValue={selected?.data.deposits_quantity}
            id="deposits_quantity"
            name="deposits_quantity"
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
            currencySymbol={currency.shortcode}
            onChange={handleAmount}
          />
          <input type="hidden" name="currency_id" value={currency.id} />
          <input type="hidden" name="currency" value={currency.shortcode} />
        </div>
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
