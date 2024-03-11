import { useContext, useEffect, useState } from "react";
import NumberInput from "../../../NumberInput";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { SessionContext } from "../../../../context/SessionContext";
import BankAccountsSelect from "../../../BankAccountsSelect";
import RateCalcInput from "../../../RateCalcInput";
import { formatAmount } from "../../../../utils/amount";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";
import { USA_CURRENCY } from "../../../../consts/currencies";

const TypeTwoIncomeWalletAccountReportForm = () => {
  const [bankAccount, setBankAccount] = useState(null);
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [rateCurrency, setRateCurrency] = useState({ id: 0, shortcode: "" });
  const [date, setDate] = useState(getDateString());
  const { handleSubmit, setError, country, selected } =
    useContext(ReportTableContext);
  const { session } = useContext(SessionContext);

  useEffect(() => {
    if (selected) {
      const { data } = selected;
      setBankAccount({
        value: parseInt(data.account_id),
        label: data.account,
        currency_id: parseInt(data.currency_id),
        currency: data.currency,
      });
      setAmount(parseFloat(data.amount));
      setRate(parseFloat(data.rate));
      if (data.rate_currency) {
        let shortcode = USA_CURRENCY.shortcode;
        if (data.rate_currency != USA_CURRENCY.id) {
          shortcode = country ? country.currency : session.country.currency.shortcode;
        }
        setRateCurrency((prev) => ({ ...prev, id: parseInt(data.rate_currency), shortcode }));
      }
      setDate(getDateString(new Date(data.date)));
    }
  }, [selected, country]);

  const handleAccountChange = (option) => {
    let newRateCurrency = { id: 0, shortcode: "" };

    if (option) {
      newRateCurrency = {
        id: option.currency_id,
        shortcode: option.currency,
      };
    }

    setRateCurrency(newRateCurrency);
    setBankAccount(option);
  };

  const handleAmountChange = (amount) => {
    setAmount(amount);
  };

  const handleRateCurrencyClick = () => {
    let newCurrency = {
      id: bankAccount.currency_id,
      shortcode: bankAccount.currency,
    };

    if (rateCurrency.id == bankAccount.currency_id) {
      newCurrency = {
        id: country?.currency_id || session.country.currency.id,
        shortcode: country?.currency || session.country.currency.shortcode,
      };
    }

    setRateCurrency(newCurrency);
  };

  const handleRateChange = (rate) => {
    setRate(rate);
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let errors = [];

    try {
      if (formData.get("transferences_quantity") === 0)
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
    setBankAccount(null);
    setDate(getDateString());
  };

  let conversion = 0;

  if (rate > 0 && bankAccount) {
    conversion = amount * rate;
    if (rateCurrency.id != bankAccount.currency_id) {
      conversion = amount / rate;
    }
  }

  conversion = formatAmount(conversion);

  let rateCalcMessage = "Seleccione una cuenta de banco";

  if (bankAccount) {
    rateCalcMessage = "1 ";
    if (rateCurrency.id == bankAccount.currency_id) {
      rateCalcMessage += `${rateCurrency.shortcode} a ${rate} ${country?.currency || session.country.currency.shortcode}`;
    } else {
      rateCalcMessage += `${country?.currency || session.country.currency.shortcode} a ${rate} ${bankAccount.currency}`;
    }
  }

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
            value={bankAccount}
            query={`&type=2`}
            onChange={handleAccountChange}
            onError={setError}
          />
        </div>
        <div className="col">
          <label htmlFor="transferences_quantity" className="form-label">
            N° de transferencias <span className="Required">*</span>
          </label>
          <NumberInput
            id="transferences_quantity"
            name="transferences_quantity"
            defaultValue={selected?.data.transferences_quantity}
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
            currencySymbol={bankAccount?.currency}
            onChange={handleAmountChange}
          />
        </div>
        <input
          type="hidden"
          name="currency_id"
          value={bankAccount?.currency_id || 0}
        />
        <input
          type="hidden"
          name="currency"
          value={bankAccount?.currency || ""}
        />
        <div className="col">
          <label htmlFor="rate" className="form-label">
            Tasa <span className="Required">*</span>
          </label>
          <RateCalcInput
            defaultValue={rate}
            message={rateCalcMessage}
            disableButton={!bankAccount}
            onClick={handleRateCurrencyClick}
            onChange={handleRateChange}
          />
          <input type="hidden" name="rate_currency" value={rateCurrency.id} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="conversion" className="form-label">
            Monto total en{" "}
            {country?.currency || session.country.currency.shortcode}
          </label>
          <input
            type="text"
            id="conversion"
            name="conversion"
            value={conversion}
            readOnly
            className="form-control"
          />
        </div>
        <input
          type="hidden"
          name="conversionCurrency"
          value={country?.currency || session.country.currency.shortcode}
        />
        <input
          type="hidden"
          name="conversionCurrency_id"
          value={country?.currency_id || session.country.currency.id}
        />
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

export default TypeTwoIncomeWalletAccountReportForm;
