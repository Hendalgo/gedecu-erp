import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SessionContext } from "../context/SessionContext";
import { getStore } from "../helpers/stores";
import Welcome from "../components/Welcome";
import { Alert } from "react-bootstrap";
import FilterTableButtons from "../components/FilterTableButtons";
import PaginationTable from "../components/PaginationTable";

export default function StoreDetail() {
    const [store, setStore] = useState(null);
    const [alert, setAlert] = useState({message: [], variant: "danger"});
    const { session } = useContext(SessionContext);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const { id } = params;

        const fetchData = async () => {
            try {
                const storeResponse = await getStore(id);
                setStore(storeResponse);
            } catch ({response}) {
                const {message} = response.data;
                console.log(message);
                if (message) setAlert((prev) => ({...prev, message: [message]}));
            }
        }

        if (![1,3].includes(session.role_id)) {
            //redirect
        }

        fetchData();
    }, [session.role_id]);

    if (!store) return <Alert show={alert.message.length > 0} variant={alert.variant} className="mt-3">
        <ul>
            {
                alert.message.map((message, index) => <li key={index}>{message}</li>)
            }
        </ul>
    </Alert>

    return (
        <>
            <section className="mb-3">
                <Welcome showButton={false} text={store.name} />
            </section>
            <section className="mb-3 p-2">
                <h5 style={{ color: "var(--blue-800)" }}>Información</h5>
                <div className="row justify-content-start">
                    <div className="col-3 text-center card py-3">
                        <p style={{color: "var(--bs-gray-600)"}}>{store.country.name} - {store.country.shortcode}</p>
                    </div>
                    <div className="col-3 card mx-4 py-3">
                        <p style={{color: "var(--bs-gray-600)"}}>Dirección</p>
                        <p className="fw-semibold">{store.location}</p>
                    </div>
                    <div className="col-3 card py-3">
                        <p style={{color: "var(--bs-gray-600)"}}>Efectivo</p>
                        <p className="fw-semibold">{store.cash_balance.currency.shortcode} {store.cash_balance.balance.toLocaleString("es-VE")}</p>
                    </div>
                </div>
            </section>
            <section>
                <div className="row justify-content-between mb-3">
                    <div className="col-8">
                        <FilterTableButtons />
                    </div>
                    <div className="col-4 text-end">
                        <button type="button" className="btn btn-outline-primary" onClick={() => navigate(`/dashboard/stores/10/accounts`)}>Registrar cuenta</button>
                    </div>
                </div>
                <div className="row mb-3">
                        <PaginationTable handleChange={() => null} itemOffset={1} itemsTotal={0} text="cuentas" />
                </div>
                <table className="table table-striped tableP">
                    <thead>
                        <tr>
                            <th>Identificador</th>
                            <th>Propietario</th>
                            <th>Balance</th>
                            <th>Banco</th>
                            <th>Creador</th>
                            <th>Fecha de creación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            store.accounts.length > 0 ?
                            <tr></tr> :
                            <tr>
                                <td colSpan={6} className="text-center">No hay cuentas de banco asociadas a este local</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </section>
        </>
    );
}