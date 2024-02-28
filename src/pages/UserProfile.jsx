import { useEffect, useState } from "react";
import { useContext } from "react";
import { handleError } from "../utils/error";
import { Alert } from "react-bootstrap";
import { updateUser } from "../helpers/users";
import Title from "../components/Title";
import ReportsByUserTable from "../components/ReportsByUserTable";
import { SessionContext } from "../context/SessionContext";
import { getReports } from "../helpers/reports";
import { getBankAccounts } from "../helpers/banksAccounts";
import TableLoader from "../components/Loaders/TableLoader";
import { formatAmount } from "../utils/amount";
import ReportsTable from "../components/ReportsTable";
import "./UserProfile.css";
import { refreshToken } from "../helpers/auth";
import { getStore } from "../helpers/stores";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [reports, setReports] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [store, setStore] = useState(null);
  const [alert, setAlert] = useState({messages: [], variant: "danger"});
  const { session, setSession } = useContext(SessionContext);

  useEffect(() => {
    const fetchData = async () => {
      let errors = [];

      const requests = [
        getReports("order=created_at&order_by=desc"),
        getBankAccounts("order=created_at&order_by=desc"),
      ];

      if (session.role_id == 3 && session.store) {
        requests.push(getStore(session.store.id));
      }

      try {
        const [reportsResponse, accountsResponse, storeResponse] = await Promise.allSettled(requests);

        if (reportsResponse.status == "fulfilled") {
          setReports(reportsResponse.value);
        } else {
          errors = errors.concat(handleError(reportsResponse.reason));
        }

        if (accountsResponse.status == "fulfilled") {
          setAccounts(accountsResponse.value);
        } else {
          errors = errors.concat(handleError(accountsResponse.reason));
        }

        if (storeResponse) {
          if (storeResponse.status == "fulfilled") {
            setStore(storeResponse.value);
          } else {
            errors = errors.concat(handleError(storeResponse.reason));
          }
        } 

        if (errors.length > 0) throw new Error(errors.join(";"));
      } catch (err) {
        console.log(err)
      }
    }
    fetchData();
  }, []);

  const handleEdit = () => {
    if (alert.messages.length > 0) setAlert((prev) => ({ ...prev, messages: [] }));
    setIsEditing(!isEditing);
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    let errors = [];
    const formData = new FormData(ev.target);
    const data = {};

    try {
      if (!formData.get("name").trim()) errors.push("El campo Nombre no debe estar vacío");

      if (formData.get("password_confirm").trim() && !formData.get("password").trim()) {
        errors.push("El campo Contraseña no debe estar vacío");
      }

      if (formData.get("password").trim()) {
        if (formData.get("password").localeCompare(formData.get("password_confirm")) !== 0) {
          errors.push("Las contraseñas no coinciden.");
        }
      }

      if (errors.length > 0) throw new Error(errors.join(";"));

      formData.forEach((val, key) => {
        if (!key.includes("password")) {
          data[key] = val.trim();
        }

        if (key.includes("password")) {
          if (val.trim()) {
            data[key] = val.trim();
          }
        }
      });

      let response = await updateUser(session.id, data);

      if (response.status == 201) {
        response = await refreshToken();

        if (response.status == 200) {
          const { user, } = response.data;

          setAlert((prev) => ({...prev, messages: []}));

          if (!user) throw new Error("Ocurrió un error con la actualización del usuario");

          setSession(user);

          setIsEditing(false);
        }
      } else {
        const { message } = response.data;
        throw new Error(message);
      }
    } catch (err) {
      const errorMessages = handleError(err);
      setAlert((prev) => ({ ...prev, messages: errorMessages }));
    }
  }

  return (
    <div className="container-fluid">
      <div className="container">
        <section className="mb-2">
          <div className="row py-3">
            <div className="col-2">
              {/* Imagen */}
            </div>
            <div className="col-8">
              <p className="m-0 UserProfileName fw-semibold">{session.name}</p>
              <p className="m-0 UserProfileRole">{session.role.name}</p>
            </div>
            <div className="col-2 text-end">
              <button type="button" onClick={() => handleEdit()} className={`btn ${isEditing ? "btn-danger" : "btn-outline-primary"}`}>{isEditing ? "Cancelar" : "Editar"}</button>
            </div>
          </div>
          {
            isEditing &&
                        <div className="row mt-4">
                          <form action="" onSubmit={handleSubmit} className="col" autoComplete="off">
                            <div className="row mb-3">
                              <div className="col">
                                <label htmlFor="name" className="form-label">Nombre <span className="Required">*</span></label>
                                <input type="text" name="name" id="name" defaultValue={session.name} className="form-control" />
                              </div>
                              <div className="col">
                                <label htmlFor="email" className="form-label">Email <span className="Required">*</span></label>
                                <input type="email" name="email" id="email" defaultValue={session.email} readOnly className="form-control" />
                              </div>
                            </div>
                            <div className="row mb-3">
                              <div className="col">
                                <label htmlFor="password" className="form-label">Contraseña</label>
                                <input type="password" name="password" id="password" className="form-control" />
                              </div>
                              <div className="col">
                                <label htmlFor="confirm-password" className="form-label">Confirme contraseña</label>
                                <input type="password" name="password_confirm" id="confirm-password" className="form-control" />
                              </div>
                            </div>
                            <div className="row mb-3">
                              <div className="col text-end">
                                <button type="submit" className="btn btn-primary">Guardar</button>
                                <button type="reset" className="ms-2 btn btn-outline-primary">Limpiar</button>
                              </div>
                            </div>
                            <Alert show={alert.messages.length > 0} variant={alert.variant}>
                              <ul className="m-0">
                                {
                                  alert.messages.map((message, index) => {
                                    return <li key={index}>{message}</li>
                                  })
                                }
                              </ul>
                            </Alert>
                          </form>
                        </div>
          }
        </section>
        <section className="mb-2">
          <Title icon="/document-white-icon.svg" title="Últimos reportes" />
          {
            session.role_id === 1 ?
              <ReportsTable data={reports} loading={reports == null} showPagination={false} /> :
              <ReportsByUserTable data={reports} loading={reports == null} showPagination={false} />
          }
        </section>
        <section className="mb-2">
          <div className="row">
            <div className="col">
              <Title icon="/bank.svg" title="Cuentas bancarias" />
              <div className="mt-4">
                {
                  accounts ?
                    <div className="w-100 overflow-hidden mb-4 border rounded">
                      <table className="m-0 table table-striped">
                        <thead>
                          <tr>
                            <th>Banco</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            accounts.data.length > 0 ?
                              accounts.data.map(({id, bank, balance, currency}) => {
                                return <tr key={id}>
                                  <td>{bank.name}</td>
                                  <td>{formatAmount(balance, currency.shortcode)}</td>
                                </tr>
                              }) :
                              <tr>
                                <td colSpan={2}>No hay registros</td>
                              </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                    :
                    <TableLoader />
                }
              </div>
            </div>
            {
              session.store &&
                            <div className="col">
                              <Title icon="/map-marker-home.svg" title="Local" />
                              {
                                store &&
                                        <div className="mt-4 p-3 card">
                                          <div className="row mb-3">
                                            <div className="col">
                                              <p className="m-0 UserProfileStoreLabel">NOMBRE:</p>
                                              <h6 className="m-0 UserProfileStoreInfo">{store.name}</h6>
                                            </div>
                                          </div>
                                          <div className="row mb-3">
                                            <div className="col">
                                              <p className="m-0 UserProfileStoreLabel">DIRECCIÓN:</p>
                                              <h6 className="m-0 UserProfileStoreInfo">{store.location}</h6>
                                            </div>
                                          </div>
                                          <div className="row mb-3">
                                            <div className="col">
                                              <p className="m-0 UserProfileStoreLabel">PAÍS:</p>
                                              <h6 className="m-0 UserProfileStoreInfo">{store.country.name}</h6>
                                            </div>
                                          </div>
                                          <div className="row mb-3">
                                            <div className="col">
                                              <p className="m-0 UserProfileStoreLabel">BALANCE:</p>
                                              <h6 className="m-0 UserProfileStoreInfo">{formatAmount(store.cash_balance.balance, store.cash_balance.currency.shortcode)}</h6>
                                            </div>
                                          </div>
                                        </div>
                              }
                            </div>
            }
          </div>
        </section>
      </div>
    </div>
  );
}