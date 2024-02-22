import { useContext, useEffect, useRef, useState } from "react";
import DecimalInput from "../../../DecimalInput";
import NumberInput from "../../../NumberInput";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { SessionContext } from "../../../../context/SessionContext";
import RateCalcInput from "../../../RateCalcInput";
import { USA_CURRENCY } from "../../../../consts/currencies";
import { formatAmount } from "../../../../utils/amount";

const TypeOneWalletReportForm = () => {
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [rateCurrency, setRateCurrency] = useState({ id: 0, shortcode: "" });
  const { handleSubmit, setError, country } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);
  const userCountry = {
    id: country?.currency_id || session.country.currency.id,
    shortcode: country?.currency || session.country.currency.shortcode,
  };

  useEffect(() => {
    setRateCurrency(USA_CURRENCY);
  }, []);

  const handleAmountChange = (amount) => {
    if (Number.isNaN(amount))
      setError((prev) => ({
        ...prev,
        show: true,
        message: "El valor ingresado es inadecuado.",
      }));
    else setAmount(amount);
  };

  const handleRateChange = (rate) => {
    if (Number.isNaN(rate))
      setError((prev) => ({
        ...prev,
        show: true,
        message: "El valor ingresado es inadecuado.",
      }));
    else setRate(rate);
  };

  const handleRateCurrencyClick = () => {
    let newCurrency = {...USA_CURRENCY};

    if (rateCurrency.id == USA_CURRENCY.id) {
      newCurrency = {
        id: userCountry.id,
        shortcode: userCountry.shortcode,
      }
    }

    setRateCurrency(newCurrency);
  }

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let errors = [];

    try {
      if (formData.get("transferences") == 0)
        errors.push("El campo N° de transferencias es obligatorio.");
      if (formData.get("amount") === "0,00")
        errors.push("El campo Monto es obligatorio.");
      if (formData.get("rate") === "0,00")
        errors.push("El campo Tasa es obligatorio.");

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
    setAmount(0);
    setRate(0);
  };

  let conversionAmount = 0;
  if (rate > 0) {
    conversionAmount = amount * rate;
    if (rateCurrency.id != USA_CURRENCY.id) {
      conversionAmount = amount / rate;
    }
  }
  conversionAmount = formatAmount(conversionAmount);

  let rateCalcMessage = "1 ";

  if (rateCurrency.id == USA_CURRENCY.id) {
    rateCalcMessage += `${rateCurrency.shortcode} a ${rate} ${userCountry.shortcode}`;
  } else {
    rateCalcMessage += `${userCountry.shortcode} a ${rate} ${USA_CURRENCY.shortcode}`;
  }

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
      <input
        type="hidden"
        id="country_id"
        name="country_id"
        value={country?.value || session.country_id}
      />
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="transferences_quantity" className="form-label">
            N° de transferencias <span className="Required">*</span>
          </label>
          <NumberInput
            id="transferences_quantity"
            name="transferences_quantity"
          />
        </div>
        <div className="col">
          <label htmlFor="amount" className="form-label">
            Monto total en USD <span className="Required">*</span>
          </label>
          <DecimalInput
            id="amount"
            name="amount"
            defaultValue={amount.toLocaleString("es-VE", {
              minimumFractionDigits: 2,
            })}
            onChange={handleAmountChange}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="rate" className="form-label">
            Tasa <span className="Required">*</span>
          </label>
          <RateCalcInput message={rateCalcMessage} onClick={handleRateCurrencyClick} onChange={handleRateChange} />
          <input type="hidden" name="rate_currency" value={rateCurrency.id} />
        </div>
        <div className="col">
          <label htmlFor="conversion" className="form-label">
            Monto total en{" "}
            {country?.currency || session.country.currency.shortcode}
          </label>
          <input
            type="text"
            id="conversion"
            name="conversion"
            value={conversionAmount}
            readOnly
            className="form-control"
          />
        </div>
        <input
          type="hidden"
          id="currency_id"
          name="currency_id"
          value={country?.currency_id || session.country.currency.id}
        />
        <input
          type="hidden"
          id="currency"
          name="currency"
          value={country?.currency || session.country.currency.shortcode}
        />
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

export default TypeOneWalletReportForm;
