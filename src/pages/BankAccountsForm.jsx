import { useEffect, useState } from "react";
import Select from "react-select";
import { getBanks } from "../helpers/banks";
import { getUsers } from "../helpers/users";
import { getCurrencies } from "../helpers/currencies";
import { createBankAccount, getBankAccount, updateBankAccount } from "../helpers/banksAccounts";
import { Alert } from "react-bootstrap";
import { Link, redirect, useLocation, useParams } from "react-router-dom";
import { DASHBOARD_ROUTE, BANKS_ROUTE, BANK_ACCOUNTS_ROUTE } from "../consts/Routes";

const BankAccountsForm = () => {
  const [banks, setBanks] = useState([]);
  const [users, setUsers] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [bankAccount, setBankAccount] = useState({ name: "", identifier: "", bank: "", user: "", });
  const [errorMessage, setErrorMessage] = useState("");
  const [alertType, setAlertType] = useState("danger");
  const [amount, setAmount] = useState("");
  const [currencyShortCode, setCurrencyShortCode] = useState("");
  const params = useParams();
  const { id } = params;
  const location = useLocation();
  const isEditPage = location.pathname.includes("edit");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [banks, users, currencies] = await Promise.all([ getBanks("paginated=no"), getUsers("paginated=no"), getCurrencies("paginated=no"), ]);

        if (banks) setBanks(banks.map(({ name, id }) => ({ label: name, value: id })));
  
        if (users) setUsers(users.map(({ name, email, id }) => ({ label: name.concat(" - ", email), value: id })));

        if (currencies) setCurrencies(currencies.map(({ id, shortcode, name }) => ({ label: name.concat(' (', shortcode, ')'), value: id })));

        if (isEditPage) {
          const bankAccountResponse = await getBankAccount(id);
          console.log(bankAccountResponse)
        }

      } catch (error) {
        console.error(error)
        // setErrorMessage(error.response.message);
        // setAlertType("danger");
      }
    }

    fetchData();
  }, [id, isEditPage]);

  const handleNameBlur = (target) => target.value = target.value.trim();

  const handleIdentifier = (target) => target.value = target.value.replace(/\D/gi, '');

  const handleCurrencyChange = ({ label }) => {
    const shortCode = label.split('(').pop().replace(')', '');
    
    setCurrencyShortCode(shortCode);
  }

  const handleAmountChange = ({ target, }) => {
    const { value } = target;

    if (value.match(/^\d+\.?\d{0,2}$/) || !value.trim()) setAmount(target.value);
    else setAmount(prev => prev);
  }

  const handleAmountFocus = ({ target }) => target.select();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;

      const data = new FormData(e.target);
      data.forEach((value, key) => console.log(key, value))

      if (isEditPage) {
        response = await updateBankAccount(id, data);
        setErrorMessage("La cuenta de banco fue actualizada exitosamente.");
      } else {
        response = await createBankAccount(data);
        console.log(response)
        setErrorMessage("La cuenta de banco fue creada exitosamente.");
      }

      setAlertType("success");
      redirect(``);
    } catch ({ response }) {
      const { data } = response;

      const errorsString = Object.values(data.errors).flat().join(". ");

      setErrorMessage(errorsString);
      setAlertType("danger");
    }
  }

  const formattedAmount = new Number(amount).toLocaleString("es-VE", {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    useGrouping: true,
  });

  return (
    <>
    <section className="container p-4 pb-0 text-end">
      <Link className="btn btn-secondary" to={`/${DASHBOARD_ROUTE}/${BANKS_ROUTE}/${BANK_ACCOUNTS_ROUTE}`}>Regresar</Link>
    </section>
      <section>
        <form method="" action="" onSubmit={handleSubmit} autoComplete="off">
          <div className="container p-4">
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="name" className="form-label">Nombre <span className="Required">*</span></label>
                <input type="text" id="name" name="name" className="form-control" defaultValue={bankAccount.name} onBlur={({ target }) => { handleNameBlur(target); }} required />
              </div>
              <div className="col">
                <label htmlFor="identifier" className="form-label">Identificador <span className="Required">*</span></label>
                <input type="text" id="identifier" name="identifier" className="form-control" maxLength={20} defaultValue={bankAccount.identifier} onChange={({ target }) => { handleIdentifier(target); }} required />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="bank" className="form-label">Banco <span className="Required">*</span></label>
                <Select inputId="bank" name="bank" placeholder="Seleccione un banco" noOptionsMessage={() => "No hay coincidencias"} defaultValue={null} options={banks} />
              </div>
              <div className="col">
                <label htmlFor="user" className="form-label">Encargado <span className="Required">*</span></label>
                <Select inputId="user" name="user" placeholder="Seleccione un manejador" noOptionsMessage={() => "No hay coincidencias"} defaultValue={null} options={users} />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="currency" className="form-label">Moneda <span className="Required">*</span></label>
                <Select inputId="currency" name="currency" placeholder="Seleccione una moneda" noOptionsMessage={() => "No hay coincidencias"} defaultValue={null} options={currencies} onChange={handleCurrencyChange} />
              </div>
              <div className="col">
                <label htmlFor="amount" className="form-label">Monto inicial <span className="Required">*</span></label>
                <input type="text" id="amount" name="amount" placeholder="" className="form-control" pattern="\d" title="Monto inicial de la cuenta de banco" value={amount} onChange={handleAmountChange} onFocus={handleAmountFocus} readOnly={isEditPage} required />
                <small>
                  { currencyShortCode } { formattedAmount }
                </small>
              </div>
            </div>
            <div className="row text-center">
              {
                errorMessage &&
                <Alert variant={alertType} style={{ maxWidth: "100%", textAlign: "center" }}>
                  {
                    errorMessage
                  }
                </Alert>
              }
              <div className="col">
                <input type="submit" className="btn btn-primary w-auto" value="Crear" />
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}

export default BankAccountsForm;
