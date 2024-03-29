import { useContext, useEffect, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import UsersSelect from "../../../UsersSelect";
import NumberInput from "../../../NumberInput";
import { Form } from "react-bootstrap";
import { SessionContext } from "../../../../context/SessionContext";
import RateCalcInput from "../../../RateCalcInput";
import { USA_CURRENCY } from "../../../../consts/currencies";
import { formatAmount } from "../../../../utils/amount";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";

export default function DepositorOutcomeWalletReportForm() {
  const [user, setUser] = useState(null);
  const { handleSubmit, setError, country, selected } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [rateCurrency, setRateCurrency] = useState({...USA_CURRENCY});
  const [date, setDate] = useState(getDateString());
  const [duplicate, setDuplicate] = useState(false);
  const currentCountry = {
    id: country?.currency_id || session.country.currency.id,
    shortcode: country?.currency || session.country.currency.shortcode,
  };

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setUser({
        value: parseInt(data.user_id),
        label: data.user,
      });
      setAmount(parseFloat(data.amount));
      setRate(parseFloat(data.rate));
      let shortcode = USA_CURRENCY.shortcode;
      if (data.rate_currency != USA_CURRENCY.id) {
        shortcode = currentCountry.shortcode;
      }
      setRateCurrency({
        id: parseInt(data.rate_currency), shortcode,
      });
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
    setRate(0);
    setDate(getDateString());
    setDuplicate(false);
  };

  const handleAmount = (value) => {
    setAmount(value);
  };

  const handleRateCurrencyClick = () => {
    let newCurrency = {...USA_CURRENCY};

    if (rateCurrency.id == USA_CURRENCY.id) {
      newCurrency = {
        id: country?.currency_id || session.country.currency.id,
        shortcode: country?.currency || session.country.currency.shortcode
      };
    }

    setRateCurrency(newCurrency);
  }

  const handleRate = (value) => {
    setRate(value);
  };

  let conversion = 0;

  if (rate > 0) {
    if (rateCurrency.id == USA_CURRENCY.id) {
      conversion = amount * rate;
    } else {
      conversion = amount / rate;
    }
  }

  conversion = formatAmount(conversion);
  let rateCalcMessage = "Seleccione un gestor";
  if (user) {
    rateCalcMessage = "1 ";
    if (rateCurrency.id == USA_CURRENCY.id) {
      rateCalcMessage += `${USA_CURRENCY.shortcode} a ${rate} ${currentCountry.shortcode}`;
    } else {
      rateCalcMessage += `${currentCountry.shortcode} a ${rate} ${USA_CURRENCY.shortcode}`;
    }
  }

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
          <NumberInput defaultValue={selected?.data.deposits_quantity} id="deposits_quantity" name="deposits_quantity" />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput defaultValue={amount} currencySymbol="USD" onChange={handleAmount} />
          <input type="hidden" name="currency_id" value={3} />
          <input type="hidden" name="currency" value="USD" />
        </div>
        <div className="col-6">
          <label htmlFor="rate" className="form-label">
            Tasa <span className="Required">*</span>
          </label>
          <RateCalcInput defaultValue={rate} message={rateCalcMessage} onClick={handleRateCurrencyClick} onChange={handleRate} />
          <input type="hidden" name="rate_currency" value={rateCurrency.id} />
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
