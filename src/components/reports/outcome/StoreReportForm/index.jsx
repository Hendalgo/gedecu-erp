import { useContext, useEffect, useState } from "react";
import BankAccountsSelect from "../../../BankAccountsSelect";
import StoresSelect from "../../../StoresSelect";
import NumberInput from "../../../NumberInput";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { Form } from "react-bootstrap";
import RateCalcInput from "../../../RateCalcInput";
import { formatAmount } from "../../../../utils/amount";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";

const StoreReportForm = () => {
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [rateCurrency, setRateCurrency] = useState({ id: 0, shortcode: "" });
  const [store, setStore] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [date, setDate] = useState(getDateString());
  const [duplicate, setDuplicate] = useState(false);
  const { handleSubmit, setError, selected } = useContext(ReportTableContext);

  useEffect(() => {
    if (selected) {
      const { data } = selected;

      setStore({
        value: parseInt(data.store_id),
        label: data.store,
        currency_id: parseInt(data.currency_id),
        currency: data.currency
      });
      setBankAccount({
        value: parseInt(data.account_id),
        label: data.account,
        currency_id: parseInt(data.conversionCurrency_id),
        currency: data.conversionCurrency
      });
      setAmount(parseFloat(data.amount));
      setRate(parseFloat(data.rate));
      setRateCurrency({
        id: parseInt(data.rate_currency),
      });
      setDuplicate(data.isDuplicated == "1" ? true : false);
      if (data.date) {
        setDate(getDateString(new Date(data.date)));
      }
    }
  }, [selected]);

  const handleStoreChange = (option) => {
    let newRateCurrency = { id: 0, shortcode: "" };

    if (option) {
      newRateCurrency = {
        id: option.currency_id,
        shortcode: option.currency,
      }
    }

    setRateCurrency(newRateCurrency);
    setStore(option);
  }

  const handleAmountChange = (amount) => {
    if (Number.isNaN(amount))
      setError({
        show: true,
        message: ["Valor inadecuado."],
        variant: "danger",
      });
    else setAmount(amount);
  };

  const handleRateCurrencyClick = () => {
    let newCurrency = {
      id: store.currency_id,
      shortcode: store.currency
    };

    if (rateCurrency.id == store.currency_id) {
      newCurrency = {
        id: bankAccount.currency_id,
        shortcode: bankAccount.currency
      }
    }

    setRateCurrency(newCurrency);
  }

  const handleRateChange = (rate) => {
    if (Number.isNaN(amount))
      setError({
        show: true,
        message: ["Valor inadecuado."],
        variant: "danger",
      });
    else setRate(rate);
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let errors = [];

    try {
      if (!store) errors.push("El campo Local es obligatorio.");
      if (!bankAccount) errors.push("El campo Cuenta es obligatorio.");
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
    setStore(null);
    setBankAccount(null);
    setDate(getDateString());
    setDuplicate(false);
  };

  let conversionAmount = 0;

  if (rate > 0 && store && bankAccount) {
    conversionAmount = amount * rate;
    if (rateCurrency.id != store.currency_id) {
      conversionAmount = amount / rate;
    }
  }
  
  conversionAmount = formatAmount(conversionAmount);

  let rateCalcMessage = "Seleccione un local y una cuenta";
  if (store && bankAccount) {
    rateCalcMessage = "1 ";
    if (rateCurrency.id == store.currency_id) {
      rateCalcMessage += `${store.currency} a ${rate} ${bankAccount.currency}`;
    } else {
      rateCalcMessage += `${bankAccount.currency} a ${rate} ${store.currency}`;

    }
  }

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="store_id" className="form-label">
            Local <span className="Required">*</span>
          </label>
          <StoresSelect
            id="store"
            name="store"
            value={store}
            onChange={handleStoreChange}
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
            value={bankAccount}
            onChange={setBankAccount}
            onError={setError}
            query="&country=2"
            placeholder="Selecciona la cuenta emisora"
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="transferences_quantity" className="form-label">
            N° de transferencias <span className="Required">*</span>
          </label>
          <NumberInput
            id="transferences_quantity"
            name="transferences_quantity"
            defaultValue={selected?.data["transferences_quantity"]}
          />
        </div>
        <div className="col">
          <label htmlFor="amount" className="form-label">
            Monto total en {store?.currency} <span className="Required">*</span>
          </label>
          <AmountCurrencyInput defaultValue={amount} currencySymbol={store?.currency} onChange={handleAmountChange} />
        </div>
      </div>
      <input type="hidden" name="currency_id" value={store?.currency_id || 0} />
      <input type="hidden" name="currency" value={store?.currency || ""} />
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="rate" className="form-label">
            Tasa de cambio <span className="Required">*</span>
          </label>
          <RateCalcInput defaultValue={rate} message={rateCalcMessage} disableButton={!store || !bankAccount} onClick={handleRateCurrencyClick} onChange={handleRateChange} />
          <input type="hidden" name="rate_currency" value={rateCurrency.id} />
        </div>
        <div className="col">
          <label htmlFor="conversion" className="form-label">
            Monto total en {bankAccount?.currency}
          </label>
          <input
            id="conversion"
            name="conversion"
            value={conversionAmount}
            readOnly
            className="form-control"
          />
          <input type="hidden" name="conversionCurrency_id" defaultValue={2} />
          <input type="hidden" name="conversionCurrency" defaultValue={"VES"} />
          <input type="hidden" name="convert_amount" defaultValue={true} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <DateInput value={date} onChange={setDate} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <Form.Check
            type="checkbox"
            id="isDuplicated"
            name="isDuplicated"
            label="Duplicado"
            checked={duplicate}
            onChange={() => setDuplicate((prev) => !prev)}
          />
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

export default StoreReportForm;
