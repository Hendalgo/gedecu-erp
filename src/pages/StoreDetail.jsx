import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SessionContext } from "../context/SessionContext";
import { getStore } from "../helpers/stores";
import Welcome from "../components/Welcome";

export default function StoreDetail() {
    const [store, setStore] = useState(null);
    const { session } = useContext(SessionContext);
    const params = useParams();

    useEffect(() => {
        const { id } = params;

        const fetchData = async () => {
            try {
                const storeResponse = await getStore(id);
    
                if (!storeResponse) {
                    // 404
                }
    
                if (storeResponse.user_id !== session.id) {
                    // forbidden
                }
    
                setStore(storeResponse);
            } catch (error) {
                console.log(error);
            }
        }

        if (![1,3].includes(session.role_id)) {
            //redirect
        }

        fetchData();
    }, [session.role_id]);

    if (!store) return <></>;

    return (
        <>
            <section className="mb-3">
                <Welcome showButton={false} text="Local" />
            </section>
            <section className="mb-3 card p-2">
                <div className="row mb-3">
                    <div className="col">
                        Nombre: {store.name}
                    </div>
                    <div className="col">
                        Dirección: {store.location}
                    </div>
                </div>
                <div className="row mb-3">
                <div className="col">
                    Fecha de creación: {store.created_at}
                </div>
                <div className="col"></div>
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
                            [].length > 0 ?
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