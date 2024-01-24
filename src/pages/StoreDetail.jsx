import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SessionContext } from "../context/SessionContext";
import { getStore } from "../helpers/stores";
import Welcome from "../components/Welcome";
import { Alert } from "react-bootstrap";

export default function StoreDetail() {
    const [store, setStore] = useState(null);
    const [alert, setAlert] = useState({message: [], variant: "danger"});
    const { session } = useContext(SessionContext);
    const params = useParams();

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
                <Welcome showButton={false} text="Local" />
            </section>
            <section className="mb-3 card p-2">
                <div className="row mb-3">
                    <div className="col">
                        <h6>Nombre</h6>
                        {store.name}
                    </div>
                    <div className="col">
                        <h6>Encargado</h6>
                        {store.user.name}
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <h6>Dirección</h6>
                        {store.location}
                    </div>
                    <div className="col">
                        <h6>Fecha de creación</h6>
                        {new Date(store.created_at).toLocaleString("es-VE", {hour12: true, day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric"})}
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <h6>País</h6>
                        {store.country.name}
                    </div>
                    <div className="col">
                        <h6>Balance</h6>
                        {store.cash_balance.currency.shortcode} {store.cash_balance.balance.toLocaleString("es-VE", {minimumFractionDigits: 2})}
                    </div>
                </div>
            </section>
            <section>
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