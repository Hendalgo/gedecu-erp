import { useContext, useEffect, useState } from "react";
import DecimalInput from "../../../DecimalInput";
import NumberInput from "../../../NumberInput";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { SessionContext } from "../../../../context/SessionContext";
import RateCalcInput from "../../../RateCalcInput";
import { USA_CURRENCY } from "../../../../consts/currencies";
import { formatAmount } from "../../../../utils/amount";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";

const TypeOneWalletReportForm = () => {
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [rateCurrency, setRateCurrency] = useState(USA_CURRENCY);
  const [date, setDate] = useState(getDateString());
  const { handleSubmit, setError, country, selected } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);
  const userCountry = {
    id: country?.currency_id || session.country.currency.id,
    shortcode: country?.currency || session.country.currency.shortcode,
  };

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setAmount(parseFloat(data.amount));
      setRate(parseFloat(data.rate));
      let shortcode = USA_CURRENCY.shortcode;
      if (data.rate_currency != USA_CURRENCY.id) {
        shortcode = userCountry.shortcode;
      }
      setRateCurrency({
        id: parseInt(data.rate_currency),
        shortcode
      });
      setDate(getDateString(new Date(data.date)));
    }
  }, [selected]);

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
    setAmount(0);
    setRate(0);
    setDate(getDateString());
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
            defaultValue={selected?.data.transferences_quantity}
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
          <input
            type="hidden"
            id="currency_id"
            name="currency_id"
            value={USA_CURRENCY.id}
          />
          <input
            type="hidden"
            id="currency"
            name="currency"
            value={USA_CURRENCY.shortcode}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="rate" className="form-label">
            Tasa <span className="Required">*</span>
          </label>
          <RateCalcInput defaultValue={rate} message={rateCalcMessage} onClick={handleRateCurrencyClick} onChange={handleRateChange} />
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
          name="conversionCurrency_id"
          value={country?.currency_id || session.country.currency.id}
        />
        <input
          type="hidden"
          name="conversionCurrency"
          value={country?.currency || session.country.currency.shortcode}
        />
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <DateInput value={date} onChange={setDate} />
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

export default TypeOneWalletReportForm;
