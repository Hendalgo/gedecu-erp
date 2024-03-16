import { useContext, useEffect, useState } from "react";
import BankAccountsSelect from "../../../BankAccountsSelect";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import RateCalcInput from "../../../RateCalcInput";
import { getDateString } from "../../../../utils/date";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { validateFields } from "../../../../utils/text";
import DateInput from "../../../DateInput";
import { USA_CURRENCY } from "../../../../consts/currencies";
import { formatAmount } from "../../../../utils/amount";

export default function TypeOneIncomeWalletTransferenceReportForm() {
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [rateCurrency, setRateCurrency] = useState({...USA_CURRENCY});
  const [date, setDate] = useState(getDateString());
  const { handleSubmit, setError, selected } = useContext(ReportTableContext);

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setAccount({
        value: parseInt(data.account_id),
        label: data.account,
        currency_id: parseInt(data.conversionCurrency_id),
        currency: data.conversionCurrency,
      });
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
        id: account.currency_id,
        shortcode: account.currency,
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
    setAccount(null);
    setAmount(0);
    setRate(0);
    setRateCurrency({...USA_CURRENCY});
    setDate(getDateString());
  }

  let conversionAmount = amount * rate;
  let rateCalcMessage = "Seleccione una cuenta";

  if (account) {
    rateCalcMessage = `1 ${USA_CURRENCY.shortcode} a ${rate} ${account.currency}`;
    if (rateCurrency.id != USA_CURRENCY.id) {
      if (rate > 0) {
        conversionAmount = amount / rate;
      }
      rateCalcMessage = `1 ${account.currency} a ${rate} ${USA_CURRENCY.shortcode}`;
    }
  }

  conversionAmount = formatAmount(conversionAmount);

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="account_id" className="form-label">
            Cuenta <span className="Required">*</span>
          </label>
          <BankAccountsSelect
            id="account"
            name="account"
            placeholder="Seleccione una cuenta"
            query="&type=1"
            value={account}
            onChange={setAccount}
            onError={setError}
          />
        </div>
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
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="rate" className="form-label">
            Tasa <span className="Required">*</span>
          </label>
          <RateCalcInput
            message={rateCalcMessage}
            defaultValue={rate}
            onChange={setRate}
            onClick={(handleRateClick)}
            disableButton={!account}
          />
          <input
            type="hidden"
            name="rate_currency"
            defaultValue={rateCurrency.id}
          />
        </div>
        <div className="col-6">
          <label htmlFor="conversion" className="form-label">
            Monto en {account?.currency}
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
            defaultValue={account?.currency_id || 0}
          />
          <input
            type="hidden"
            name="conversionCurrency"
            defaultValue={account?.currency || ""}
          />
          <input type="hidden" name="convert_amount" defaultValue={true} />
        </div>
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
}