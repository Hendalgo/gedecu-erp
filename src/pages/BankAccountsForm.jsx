import { useEffect, useState } from "react";
import Select from "react-select";
import { getBanks } from "../helpers/banks";
import { getUsers } from "../helpers/users";
import { createBankAccount, getBankAccount, updateBankAccount } from "../helpers/banksAccounts";
import { Alert } from "react-bootstrap";
import { redirect, useLocation, useParams } from "react-router-dom";

class BankAccount {
  constructor({
    name = "Antonio Sotillo", identifier = "123456789", bank = "1", user = "2"
  }) {
    this.name = name;
    this.identifier = identifier;
    this.bank = bank;
    this.user = user;
  }
}

const BankAccountsForm = () => {
  const [banks, setBanks] = useState([]);
  const [users, setUsers] = useState([]);
  const [bankAccount, setBankAccount] = useState(new BankAccount({}));
  const [errorMessage, setErrorMessage] = useState("");
  const [alertType, setAlertType] = useState("danger");
  const params = useParams();
  const { id } = params;
  const location = useLocation();
  const isEditPage = location.pathname.includes("edit");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [banks, users] = await Promise.all([ getBanks("paginated=no"), getUsers("paginated=no"), ]);

        if (banks) setBanks(banks.map(({ name, id }) => ({ label: name, value: id })));
  
        if (users) setUsers(users.map(({ name, email, id }) => ({ label: name.concat(" - ", email), value: id })));

        if (isEditPage) {
          const { message } = await getBankAccount(id);

          console.log(message)
        }

      } catch (error) {
        setErrorMessage(error.message);
        setAlertType("danger");
      }
    }

    fetchData();
  }, [id, isEditPage]);

  const handleNameBlur = (target) => target.value = target.value.trim();

  const handleIdentifier = (target) => target.value = target.value.replace(/\D/gi, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;

      const data = new FormData(e.target);
      data.forEach((value, key) => console.log(key, value))

      if (isEditPage) {
      //   response = updateBankAccount(id, data);
        setErrorMessage("La cuenta de banco fue actualizada exitosamente.");
      } else {
      //   response = createBankAccount(data);
        setErrorMessage("La cuenta de banco fue creada exitosamente.");
      }
      setAlertType("success");
      redirect(``);

      // switch (response.status) {
      //   case 201:
      //     setErrorMessage('Banco creado con éxito')
      //     setAlertType('success')
      //     navigate(``);
      //     break

      //   case 422:
      //     setErrorMessage(response.data.message)
      //     setAlertType('danger')
      //     break

      //   default:
      //     setErrorMessage('Error en la creación del banco')
      //     setAlertType('danger')
      //     break
      // }
    } catch (error) {
      setErrorMessage(error.message);
      setAlertType("danger");
    }
  }

  return (
    <>
      <section>
        <form method="" action="" onSubmit={handleSubmit} autoComplete="off">
          <div className="container">
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
                <Select id="bank" name="bank" placeholder="Seleccione un banco" noOptionsMessage={() => "No hay coincidencias"} options={banks} />
              </div>
              <div className="col">
                <label htmlFor="user" className="form-label">Encargado <span className="Required">*</span></label>
                <Select id="user" name="user" placeholder="Seleccione un manejador" noOptionsMessage={() => "No hay coincidencias"} options={users} defaultValue={bankAccount.user} />
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
              <input type="submit" className="btn btn-primary" value="Crear" />
            </div>
          </div>
        </form>
      </section>
    </>
  );
}

export default BankAccountsForm;
