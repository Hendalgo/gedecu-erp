import { useEffect, useState } from "react";
import Select from "react-select";
import { getBanks } from "../helpers/banks";
import { getUsers } from "../helpers/users";
import { getCurrencies } from "../helpers/currencies";
import { createBankAccount, getBankAccount, updateBankAccount } from "../helpers/banksAccounts";
import { Alert } from "react-bootstrap";
import { redirect, useLocation, useParams } from "react-router-dom";

const BankAccountsForm = () => {
  const [banks, setBanks] = useState([]);
  const [users, setUsers] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [bankAccount, setBankAccount] = useState({ name: "Antonio", identifier: "12345678", bank: 1, user: 9, });
  const [errorMessage, setErrorMessage] = useState("");
  const [alertType, setAlertType] = useState("danger");
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

  const handleAmountChange = ({ target, type }) => {
    // console.log(parseFloat(target.value))
    // target.value = new Number(parseFloat(target.value)).toLocaleString("es-VE", { maximumFractionDigits: 2, minimumFractionDigits: 0, useGrouping: type == "blur" });
  }

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

  return (
    <>
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
                <Select id="bank" name="bank" placeholder="Seleccione un banco" noOptionsMessage={() => "No hay coincidencias"} defaultValue={null} options={banks} />
              </div>
              <div className="col">
                <label htmlFor="user" className="form-label">Encargado <span className="Required">*</span></label>
                <Select id="user" name="user" placeholder="Seleccione un manejador" noOptionsMessage={() => "No hay coincidencias"} defaultValue={null} options={users} />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="currency" className="form-label">Moneda <span className="Required">*</span></label>
                <Select id="currency" name="currency" placeholder="Seleccione una moneda" noOptionsMessage={() => "No hay coincidencias"} defaultValue={null} options={currencies} />
              </div>
              <div className="col">
                <label htmlFor="amount" className="form-label">Monto inicial <span className="Required">*</span></label>
                <input type="text" id="amount" name="amount" placeholder="" className="form-control" onChange={handleAmountChange} onBlur={handleAmountChange} readOnly={isEditPage} required />
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
