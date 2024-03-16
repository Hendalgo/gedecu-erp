import { useContext, useEffect, useState } from "react";
import { getDateString } from "../../../../utils/date";
import { formatAmount } from "../../../../utils/amount";
import BankAccountsSelect from "../../../BankAccountsSelect";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import RateCalcInput from "../../../RateCalcInput";
import DateInput from "../../../DateInput";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { validateFields } from "../../../../utils/text";

export default function TypeOneOutcomeWalletTransferenceReportForm() {
  const [wallet, setWallet] = useState(null);
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [rateCurrency, setRateCurrency] = useState({ id: 0, shortcode: "" });
  const [date, setDate] = useState(getDateString());
  const { handleSubmit, setError, selected } = useContext(ReportTableContext);

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setWallet({
        value: parseInt(data.wallet_id),
        label: data.wallet,
        currency_id: parseInt(data.currency_id),
        currency: data.currency
      });
      setAccount({
        value: parseInt(data.account_id),
        label: data.account,
        currency_id: parseInt(data.conversionCurrency_id),
        currency: data.conversionCurrency,
      });
      setAmount(new Number(data.amount));
      setRate(new Number(data.rate));
      let shortcode = data.currency;
      if (data.rate_currency != data.currency_id) {
        shortcode = data.conversionCurrency;
      }
      setRateCurrency({
        id: parseInt(data.rate_currency),
        shortcode
      });
      setDate(getDateString(new Date(data.date)));
    }
  }, [selected]);

  const handleWalletChange = (option) => {
    let newRateCurrency = {
      id: 0,
      shortcode: ""
    };

    if (option) {
      newRateCurrency = {
        id: option.currency_id,
        shortcode: option.currency
      };
    }

    setWallet(option);
    setRateCurrency(newRateCurrency);
  }

  const handleRateClick = () => {
    let newRateCurrency = {
      id: wallet.currency_id,
      shortcode: wallet.currency
    };

    if (rateCurrency.id == wallet.currency_id) {
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
    setWallet(null);
    setAccount(null);
    setAmount(0);
    setRate(0);
    setRateCurrency({ id: 0, shortcode: "" });
    setDate(getDateString());
  }

  let conversionAmount = amount * rate;
  let rateCalcMessage = "Seleccione la cuenta de billetera y la cuenta bancaria";

  if (wallet && account) {
    rateCalcMessage = `1 ${wallet.currency} a ${rate} ${account.currency}`;
    if (rateCurrency.id != wallet.currency_id) {
      if (rate > 0) {
        conversionAmount = amount / rate;
      }
      rateCalcMessage = `1 ${account.currency} a ${rate} ${wallet.currency}`;
    }
  }

  conversionAmount = formatAmount(conversionAmount);

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="wallet_id" className="form-label">
            Billetera <span className="Required">*</span>
          </label>
          <BankAccountsSelect
            id="wallet"
            name="wallet"
            placeholder="Seleccione una billtera"
            query="&type=2"
            value={wallet}
            onChange={handleWalletChange}
            onError={setError}
          />
        </div>
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
      </div>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <AmountCurrencyInput
            defaultValue={amount}
            onChange={setAmount}
            currencySymbol={wallet?.currency}
          />
          <input
            type="hidden"
            name="currency_id"
            value={wallet?.currency_id || 0}
          />
          <input type="hidden" name="currency" value={wallet?.currency || ""} />
        </div>
        <div className="col-6">
          <label htmlFor="rate" className="form-label">
            Tasa <span className="Required">*</span>
          </label>
          <RateCalcInput
            message={rateCalcMessage}
            defaultValue={rate}
            onChange={setRate}
            onClick={handleRateClick}
            disableButton={!wallet || !account}
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
        </div>
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