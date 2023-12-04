import { useEffect, useState } from "react";
import Select from "react-select";
import { getBanks } from "../helpers/banks";
import { getUsers } from "../helpers/users";
import { createBankAccount } from "../helpers/banksAccounts";
import { Alert } from "react-bootstrap";

const BankAccountsDetail = () => {
  const [banks, setBanks] = useState([]);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertType, setAlertType] = useState("danger");

  useEffect(() => {
    Promise.all([ getBanks("paginated=no"), getUsers("paginated=no"), ])
    .then(([banks, users]) => {
      if (banks) setBanks(banks.map(({ name, id }) => ({ label: name, value: id })));

      if (users) setUsers(users.map(({ name, email, id }) => ({ label: name.concat(" - ", email), value: id })));
    })
    .catch((error) => {
      console.error(error)
    });
  }, []);

  const handleNameBlur = (target) => target.value = target.value.trim();

  const handleIdentifier = (target) => target.value = target.value.replace(/\D/gi, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = new FormData(e.target);
      
      const response = await createBankAccount(data);

      switch (response.status) {
        case 201:
          setErrorMessage('Banco creado con éxito')
          setAlertType('success')

          // window.location.reload();
          break
        case 422:
          setErrorMessage(response.data.message)
          setAlertType('danger')
          break

        default:
          setErrorMessage('Error en la creación del banco')
          setAlertType('danger')
          break
      }
    } catch (error) {
      setErrorMessage(error.message);
      setAlertType("danger");
    }
  }

  return (
    <>
      <section>
        <form method="" action="" onSubmit={handleSubmit} onReset={() => {}} autoComplete="off">
          <div className="container">
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="name" className="form-label">Nombre <span className="Required">*</span></label>
                <input type="text" id="name" name="name" className="form-control" onBlur={({ target }) => handleNameBlur(target)} required />
              </div>
              <div className="col">
                <label htmlFor="identifier" className="form-label">Identificador <span className="Required">*</span></label>
                <input type="text" id="identifier" name="identifier" className="form-control" maxLength={20} required onChange={({ target }) => handleIdentifier(target)} />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="bank" className="form-label">Banco <span className="Required">*</span></label>
                <Select id="bank" name="bank" placeholder="Seleccione un banco" noOptionsMessage={() => "No hay coincidencias"} options={banks} />
              </div>
              <div className="col">
                <label htmlFor="user" className="form-label">Encargado <span className="Required">*</span></label>
                <Select id="user" name="user" placeholder="Seleccione un manejador" noOptionsMessage={() => "No hay coincidencias"} options={users} />
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

export default BankAccountsDetail;
