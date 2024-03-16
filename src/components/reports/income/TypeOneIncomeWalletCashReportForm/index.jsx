import { useContext, useEffect, useState } from "react";
import { getDateString } from "../../../../utils/date";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { validateFields } from "../../../../utils/text";
import { formatAmount } from "../../../../utils/amount";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import RateCalcInput from "../../../RateCalcInput";
import DateInput from "../../../DateInput";
import { USA_CURRENCY } from "../../../../consts/currencies";
import { SessionContext } from "../../../../context/SessionContext";

export default function TypeOneIncomeWalletCashReportForm() {
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [rateCurrency, setRateCurrency] = useState({...USA_CURRENCY});
  const [date, setDate] = useState(getDateString());
  const { handleSubmit, setError, selected } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);
  const country = {
    currency_id: session.country.currency.id,
    currency: session.country.currency.shortcode
  };

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setAmount(new Number(data.amount));
      setRate(new Number(data.rate));
      let shortcode = USA_CURRENCY.shortcode;
      if (data.rate_currency != USA_CURRENCY.id) {
        shortcode = data.conversionCurrency;
      }
      setRateCurrency({
        id: parseInt(data.rate_currency),
        shortcode
      });
      setDate(getDateString(new Date(data.date)));
    }
  }, [selected]);

  const handleRateClick = () => {
    let newRateCurrency = { ...USA_CURRENCY };
    if (rateCurrency.id == USA_CURRENCY.id) {
      newRateCurrency = {
        id: country.currency_id,
        shortcode: country.currency,
      };
    }
    setRateCurrency(newRateCurrency);
  }

  const handleLocalSubmit = (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    try {
      let errors = validateFields(formData);
      if (errors.length > 0) throw new Error(errors.join(";"));
      handleSubmit(formData);
      ev.target.reset();
    } catch (err) {
      setError({
        show: true,
        message: err.message.split(";"),
        variant: "danger",
      });
    }
  }

  const handleReset = () => {
    setAmount(0);
    setRate(0);
    setRateCurrency({...USA_CURRENCY});
    setDate(getDateString());
  }

  let conversionAmount = amount * rate;
  let rateCalcMessage = "Seleccione una cuenta";

  rateCalcMessage = `1 ${USA_CURRENCY.shortcode} a ${rate} ${country.currency}`;
  if (rateCurrency.id != USA_CURRENCY.id) {
    if (rate > 0) {
      conversionAmount = amount / rate;
    }
    rateCalcMessage = `1 ${country.currency} a ${rate} ${USA_CURRENCY.shortcode}`;
  }

  conversionAmount = formatAmount(conversionAmount);

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput
            defaultValue={amount}
            onChange={setAmount}
            currencySymbol={USA_CURRENCY.shortcode}
          />
          <input type="hidden" name="currency_id" value={USA_CURRENCY.id} />
          <input type="hidden" name="currency" value={USA_CURRENCY.shortcode} />
        </div>
        <div className="col-6">
          <label htmlFor="rate" className="form-label">
            Tasa <span className="Required">*</span>
          </label>
          <RateCalcInput
            message={rateCalcMessage}
            defaultValue={rate}
            onChange={setRate}
            onClick={(handleRateClick)}
          />
          <input
            type="hidden"
            name="rate_currency"
            defaultValue={rateCurrency.id}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="conversion" className="form-label">
            Monto en {country?.currency}
          </label>
          <input
            id="conversion"
            name="conversion"
            value={conversionAmount}
            readOnly
            className="form-control"
          />
          <input
            type="hidden"
            name="conversionCurrency_id"
            defaultValue={country?.currency_id || 0}
          />
          <input
            type="hidden"
            name="conversionCurrency"
            defaultValue={country?.currency || ""}
          />
          <input type="hidden" name="convert_amount" defaultValue={true} />
        </div>
        <div className="col-6">
          <DateInput value={date} onChange={setDate} />
        </div>
      </div>
      <div className="row mb-3">
      </div>
      <div className="row text-end">
        <div className="col">
          <button type="submit" className="btn btn-outline-primary">
            Agregar
          </button>
        </div>
      </div>
      <div className="row"></div>
    </form>
  );
}