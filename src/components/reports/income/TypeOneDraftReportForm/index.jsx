import { useContext, useEffect, useRef, useState } from "react";
import DecimalInput from "../../../DecimalInput";
import NumberInput from "../../../NumberInput";
import BanksSelect from "../../../BanksSelect";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { SessionContext } from "../../../../context/SessionContext";
import Select from "react-select";
import { getUsers } from "../../../../helpers/users";
import RateCalcInput from "../../../RateCalcInput";
import { formatAmount } from "../../../../utils/amount";
import { VZLA_CURRENCY } from "../../../../consts/currencies";

const TypeOneDraftReportForm = () => {
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [rateCurrency, setRateCurrency] = useState({ id: 0, shortcode: "" });
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [bank, setBank] = useState(null);
  const { handleSubmit, setError, country } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);
  const originCurrency = useRef({ id: 0, shortcode: "" });

  useEffect(() => {
    originCurrency.current = {
      id: session.country.currency.id,
      shortcode: session.country.currency.shortcode
    };

    if (country) {
      originCurrency.current.id = country.currency_id;
      originCurrency.current.shortcode = country.currency;
    }

    setRateCurrency(originCurrency.current);
  }, []);

  const handleBankChange = async (option) => {
    if (option?.value !== bank?.value) {
      setBank(option);
      setUsers([]);
      setUser(null);

      if (option) {
        try {
          const usersResponse = await getUsers(
            `paginated=no&bank=${option.value}`,
          );

          if (usersResponse)
            setUsers(
              usersResponse.data.map(({ name, email, id }) => {
                const label = name.concat(" (", email, ")");
                return { label: label, value: id };
              }),
            );
        } catch (error) {
          setError({ show: true, message: [], variant: "danger" });
        }
      }
    }
  };

  const handleAmountChange = (amount) => {
    if (Number.isNaN(amount))
      setError({
        show: true,
        message: ["Valor inadecuado."],
        variant: "danger",
      });
    else setAmount(amount);
  };

  const handleRateChange = (rate) => {
    if (Number.isNaN(amount))
      setError({
        show: true,
        message: ["Valor inadecuado."],
        variant: "danger",
      });
    else {
      setRate(rate);
    }
  };

  const handleRateCurrencyClick = () => {
    let newCurrency = {...VZLA_CURRENCY};

    if (rateCurrency.id == VZLA_CURRENCY.id) {
      newCurrency = {...originCurrency.current};
    }

    setRateCurrency(newCurrency);
  }

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let errors = [];

    try {
      if (!bank) errors.push("El campo Banco es obligatorio.");
      if (!user) errors.push("El campo Gestor es obligatorio.");
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
    setUser(null);
    setBank(null);
    setAmount(0);
    setRate(0);
  };

  let conversionAmount = 0;

  if (rate > 0) {
    conversionAmount = amount * rate;

    if (rateCurrency.id !== originCurrency.current.id) {
      conversionAmount = amount / rate;
    }
  }
  
  conversionAmount = formatAmount(conversionAmount);

  let rateCalcMessage = "1 ";

  if (rateCurrency.id == originCurrency.current.id) {
    rateCalcMessage += `${originCurrency.current.shortcode} a ${rate} ${VZLA_CURRENCY.shortcode}`;
  } else {
    rateCalcMessage += `${VZLA_CURRENCY.shortcode} a ${rate} ${originCurrency.current.shortcode}`;
  }

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
      <input
        type="hidden"
        id="country_id"
        name="country_id"
        value={country?.id_country || session.country_id}
      />
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="bank_id" className="form-label">
            Banco <span className="Required">*</span>
          </label>
          <BanksSelect
            id="bank"
            name="bank"
            value={bank}
            onChange={handleBankChange}
            onError={setError}
            query="&country=2"
          />
        </div>
        <div className="col">
          <label htmlFor="user_id" className="form-label">
            Gestor <span className="Required">*</span>
          </label>
          <Select
            inputId="user_id"
            name="user_id"
            value={user}
            options={users}
            onChange={setUser}
            placeholder="Selecciona el gestor"
            noOptionsMessage={() => "No hay coincidencias"}
            isDisabled={users.length === 0}
          />
          <input type="hidden" name="user" value={user?.label || ""} />
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
          />
        </div>
        <div className="col">
          <label htmlFor="amount" className="form-label">
            Monto total en{" "}
            {country?.currency || session.country.currency.shortcode}{" "}
            <span className="Required">*</span>
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
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="rate" className="form-label">
            Tasa <span className="Required">*</span>
          </label>
          <RateCalcInput message={rateCalcMessage} onChange={handleRateChange} onClick={handleRateCurrencyClick} />
          <input type="hidden" name="rate_currency" value={rateCurrency.id} />
        </div>
        <div className="col">
          <label htmlFor="conversion" className="form-label">
            Monto total en VES
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

export default TypeOneDraftReportForm;
