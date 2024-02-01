import { useEffect, useRef, useState } from "react";
import { getCurrencies, getCurrencyById } from "../../../../helpers/currencies";
import Select from "react-select";
import { getBankAccounts } from "../../../../helpers/banksAccounts";

export default function OthersForm() {
  const [currencies, setCurrencies] = useState([]);
  const [currency, setCurrency] = useState(null);
  const [store, setStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [account, setAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const paymentMethods = useRef([
    { label: "Efectivo", value: 1 },
    { label: "Transferencia", value: 2 },
  ]);

  const [paymentMethod, setPaymentMethod] = useState(
    paymentMethods.current.at(0),
  );

  useEffect(() => {
    const fetchData = async () => {
      const [currenciesResponse] = await Promise.all([
        getCurrencies("paginated=no"),
      ]);

      let filteredCurrencies = [];

      currenciesResponse.forEach(({ name, shortcode, id }) => {
        if (id !== 2) {
          filteredCurrencies.push({
            label: `${name} (${shortcode})`,
            value: id,
            shortcode: shortcode,
          });
        }
      });

      setCurrencies(filteredCurrencies);
    };

    fetchData();
  }, []);

  const handleCurrencyChange = async (option) => {
    setStore(null);
    setCurrency(option);

    try {
      const storesResponse = await getCurrencyById(option.value, "stores=yes");
      setStores(
        storesResponse.data.map(({ id, name }) => ({
          label: `${name}`,
          value: id,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleStoreChange = async (option) => {
    setStore(option);
    if (paymentMethod.value === 2) {
      try {
        const accountsResponse = await getBankAccounts(
          `paginated=no&currency=${currency.value}&store=${option.value}`,
        );
        setAccounts(
          accountsResponse.map(({ name, identifier, id }) => ({
            label: `${name} - ${identifier}`,
            value: id,
          })),
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePaymentMethodChange = (option) => {
    setCurrency(null);
    setStore(null);
    setStores([]);
    setAccount(null);
    setAccounts([]);
    setPaymentMethod(option);
  };

  return (
    <>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="paymentMethod" className="form-label">
            Medio de pago
          </label>
          <Select
            inputId="paymentMethod"
            name="paymentMethod_id"
            options={paymentMethods.current}
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            noOptionsMessage={() => "No hay coincidencias"}
          />
          <input
            type="hidden"
            name="paymentMethod"
            value={paymentMethod.label || ""}
          />
        </div>
        <div className="col">
          <label htmlFor="currency" className="form-label">
            Divisa
          </label>
          <Select
            inputId="currency"
            name="currency_id"
            options={currencies}
            value={currency}
            placeholder="Seleccione una divisa"
            onChange={handleCurrencyChange}
            noOptionsMessage={() => "No hay coincidencias"}
          />
          <input
            type="hidden"
            name="currency"
            value={currency?.shortcode || ""}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="store_id" className="form-label">
            Local <span className="Required">*</span>
          </label>
          <Select
            isDisabled={stores.length === 0}
            inputId="store_id"
            name="store_id"
            options={stores}
            value={store}
            onChange={handleStoreChange}
            placeholder="Seleccione el local"
            noOptionsMessage={() => "No hay coincidencias"}
          />
          <input type="hidden" name="store" value={store?.label || ""} />
        </div>
      </div>
      {paymentMethod.value === 2 && (
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="account_id" className="form-label">
              Cuenta <span className="Required">*</span>
            </label>
            <Select
              isDisabled={accounts.length === 0}
              inputId="account_id"
              name="account_id"
              options={accounts}
              value={account}
              onChange={setAccount}
              placeholder="Seleccione la cuenta de banco"
              noOptionsMessage={() => "No hay coincidencias"}
            />
            <input type="hidden" name="account" value={account?.label || ""} />
          </div>
        </div>
      )}
    </>
  );
}
