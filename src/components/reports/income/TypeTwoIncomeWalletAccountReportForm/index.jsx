import { useContext, useState } from "react";
import DecimalInput from "../../../DecimalInput";
import NumberInput from "../../../NumberInput";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { SessionContext } from "../../../../context/SessionContext";
import BankAccountsSelect from "../../../BankAccountsSelect";
import RateCalcInput from "../../../RateCalcInput";
import { formatAmount } from "../../../../utils/amount";

const TypeTwoIncomeWalletAccountReportForm = () => {
  const [bankAccount, setBankAccount] = useState(null);
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [rateCurrency, setRateCurrency] = useState({ id: 0, shortcode: "" });
  const { handleSubmit, setError, country } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);

  const handleAccountChange = (option) => {
    let newRateCurrency = { id: 0, shortcode: "" };

    if (option) {
      newRateCurrency = {
        id: option.currency_id,
        shortcode: option.currency,
      }
    }

    setRateCurrency(newRateCurrency);
    setBankAccount(option);
  }

  const handleAmountChange = (amount) => {
    setAmount(amount);
  };

  const handleRateCurrencyClick = () => {
    let newCurrency = {
      id: bankAccount.currency_id,
      shortcode: bankAccount.currency
    };

    if (rateCurrency.id == bankAccount.currency_id) {
      newCurrency = {
        id: country?.currency_id || session.country.currency.id,
        shortcode: country?.currency || session.country.currency.shortcode
      }
    }

    setRateCurrency(newCurrency);
  }

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
  };

  let conversion = 0;

  if (rate > 0 && bankAccount) {
    conversion = amount * rate;
    if (rateCurrency.id != bankAccount.currency_id) {
      conversion = amount / rate;
    }
  }

  conversion = formatAmount(conversion);

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
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <DecimalInput
            id="amount"
            name="amount"
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
          <RateCalcInput currency={rateCurrency?.shortcode ? `Tasa en ${rateCurrency?.shortcode}` : "Seleccione una cuenta"} disableButton={!bankAccount} onClick={handleRateCurrencyClick} onChange={handleRateChange} />
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
