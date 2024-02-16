import { useEffect, useState } from "react";
import { useContext } from "react";
import { handleError } from "../utils/error";
import { Alert } from "react-bootstrap";
import { updateUser } from "../helpers/users";
import { me } from "../helpers/me";
import Title from "../components/Title";
import ReportsByUserTable from "../components/ReportsByUserTable";
import { SessionContext } from "../context/SessionContext";
import { getReports } from "../helpers/reports";
import { getBankAccounts } from "../helpers/banksAccounts";
import TableLoader from "../components/Loaders/TableLoader";
import { formatAmount } from "../utils/amount";
import ReportsTable from "../components/ReportsTable";

export default function UserProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [reports, setReports] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [alert, setAlert] = useState({messages: [], variant: "danger"});
    const { session } = useContext(SessionContext); // Habrá que reasignar la sesión...

    useEffect(() => {
        const fetchData = async () => {
            let errors = [];

            try {
                const [reportsResponse, accountsResponse,] = await Promise.allSettled([
                    getReports("order=created_at&order_by=desc"),
                    getBankAccounts("order=created_at&order_by=desc"),
                ]);

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

                if (errors.length > 0) throw new Error(errors.join(";"));
            } catch (err) {
                console.log(err)
            }
        }
        fetchData();
    }, []);

    const getUser = async () => {
        try {
            const response = await me();
            console.log(response);
        } catch (err) {
            const errorMessages = handleError(err);
            setAlert((prev) => ({ ...prev, messages: errorMessages }));
        }
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        let errors = [];
        const formData = new FormData(ev.target);
        const data = {};
        try {
            if (!formData.get("name").trim()) errors.push("El campo Nombre no debe estar vacío");
            if (!formData.get("email").trim()) errors.push("El campo Correo no debe estar vacío");
            if (formData.get("password").trim()) {
                if (formData.get("password").localeCompare(formData.get("confirm-password")) !== 0) {
                    errors.push("Las contraseñas no coinciden.");
                }
            }
            if (errors.length > 0) throw new Error(errors.join(";"));
            formData.forEach((val, key) => {
                data[key] = val.trim();
            });
            const response = await updateUser(session.id, data);
            console.log(response);
            setAlert((prev) => ({...prev, messages: []}));
            setIsEditing(false);
            getUser();
        } catch (err) {
            const errorMessages = handleError(err);
            setAlert((prev) => ({ ...prev, messages: errorMessages }));
        }
    }
    return (
        <div className="container-fluid">
            <div className="container">
                <section className="mb-2">
                    {/* Profile data and actions */}
                    <div className="row">
                        <div className="col-2">
                            {/* Imagen */}
                        </div>
                        <div className="col-8">
                            <p className="m-0">{session.name}</p>
                            <p className="m-0">{session.role.name}</p>
                        </div>
                        <div className="col-2 text-end">
                            <button type="button" onClick={() => setIsEditing(!isEditing)} className={`btn ${isEditing ? "btn-danger" : "btn-outline-primary"}`}>{isEditing ? "Cancelar" : "Editar"}</button>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <form action="" onSubmit={handleSubmit} className="col" autoComplete="off">
                            <p className="m-0 mb-3">Editar datos</p>
                            <div className="row mb-3">
                                <div className="col">
                                    <label htmlFor="name" className="form-label">Nombre <span className="Required">*</span></label>
                                    <input type="text" name="name" id="name" className="form-control" />
                                </div>
                                <div className="col">
                                    <label htmlFor="email" className="form-label">Email <span className="Required">*</span></label>
                                    <input type="email" name="email" id="email" className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input type="password" name="password" id="password" className="form-control" />
                                </div>
                                <div className="col">
                                    <label htmlFor="confirm-password" className="form-label">Confirme contraseña</label>
                                    <input type="password" name="confirm-password" id="confirm-password" className="form-control" />
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
                            </div>
                        }
                    </div>
                </section>
            </div>
        </div>
    );
}