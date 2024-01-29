import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SessionContext } from "../context/SessionContext";
import { getStore } from "../helpers/stores";
import Welcome from "../components/Welcome";
import { Alert } from "react-bootstrap";
import FilterTableButtons from "../components/FilterTableButtons";
import PaginationTable from "../components/PaginationTable";
import { ReactSVG } from "react-svg";
import { BANK_ACCOUNTS_ROUTE, DASHBOARD_ROUTE, HOME_ROUTE, STORES_ROUTE } from "../consts/Routes";
import { formatAmount } from "../utils/amount";
import { useFormatDate } from "../hooks/useFormatDate";
import { getBanks } from "../helpers/banks";

export default function StoreDetail() {
    const [store, setStore] = useState(null);
    const [alert, setAlert] = useState({message: [], variant: "danger"});
    const [banks, setBanks] = useState([]);
    const [bank, setBank] = useState(false);
    const [offset, setOffset] = useState(1);
    const { session } = useContext(SessionContext);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const { id } = params;

        const fetchData = async () => {
            try {
                const [storeResponse, banksResponse] = await Promise.all([getStore(id), getBanks("paginated=no")]);
                setStore(storeResponse);
                setBanks(banksResponse);
            } catch ({response}) {
                const {message} = response.data;
                if (message) setAlert((prev) => ({...prev, message: [message]}));
            }
        }

        if (![1,3].includes(session.role_id)) {
            navigate(`/${DASHBOARD_ROUTE}/${HOME_ROUTE}`);
        }

        fetchData();
    }, []);

    const handleBankChange = async (option) => {
        setOffset(1);
        setBank(option);

        let params = `${option ? `bank=${option}` : ""}`;

        console.log(params);
    }

    const handlePagination = async ({selected}) => {
        const newOffset = selected + 1;
        setOffset(newOffset);

        let params = `page=${newOffset}`;

        if (bank) params += `&bank=${bank}`;

        console.log(params);
    }

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
                
                <h5 className="mb-3"><ReactSVG src="/info-circle.svg" wrapper="span" className="bg-white px-1 rounded" /> <span style={{ color: "var(--blue-800, #052C65)" }}>Información</span> <ReactSVG src="/info.svg" wrapper="span" /></h5>
                <div className="row justify-content-start">
                    <div className="col-3 text-center card py-3">
                        <p style={{color: "var(--bs-gray-600)"}} className="text-nowrap text-truncate"><ReactSVG src="/world.svg" wrapper="span" /> {store.country.name} - {store.country.shortcode}</p>
                    </div>
                    <div className="col-4 card mx-4 py-3">
                        <p style={{color: "var(--bs-gray-600)"}}><ReactSVG src="/map-marker-home.svg" wrapper="span" /> Dirección</p>
                        <p className="fw-semibold fs-6" style={{color: "var(--blue-800, #052C65)"}}>{store.location}</p>
                    </div>
                    <div className="col-3 card py-3">
                        <p style={{color: "var(--bs-gray-600)"}}><img src="/imoney.png" alt="cash icon" width={18} height={18} /> Efectivo</p>
                        <p className="fw-semibold" style={{color: "var(--blue-800, #052C65)"}}>{formatAmount(store.cash_balance.balance, store.cash_balance.currency.shortcode)}</p>
                    </div>
                </div>
            </section>
            <section>
                <div className="row justify-content-between mb-3">
                    <div className="col-8">
                        <FilterTableButtons data={banks} callback={handleBankChange} />
                    </div>
                    <div className="col-4 text-end">
                        <button type="button" className="btn btn-outline-primary" onClick={() => navigate(`/${DASHBOARD_ROUTE}/${STORES_ROUTE}/${params.id}/${BANK_ACCOUNTS_ROUTE}`)}>Registrar cuenta</button>
                    </div>
                </div>
                <div className="row mb-3">
                    <PaginationTable handleChange={handlePagination} offset={offset} itemsTotal={store.accounts.length} quantity={Math.ceil(store.accounts.length / 10)} text="cuentas" />
                </div>
                <table className="table table-striped tableP">
                    <thead>
                        <tr>
                            <th>Identificador</th>
                            <th>Propietario</th>
                            <th>Balance</th>
                            <th>Banco</th>
                            <th>Fecha de creación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            store.accounts.length > 0 ?
                            store.accounts.map(({id, identifier, name, balance, currency, bank, created_at}) => <tr key={id}>
                                <td>{identifier}</td>
                                <td>{name}</td>
                                <td>{formatAmount(balance, currency.shortcode)}</td>
                                <td>{bank.name}</td>
                                <td>{useFormatDate(created_at)}</td>
                            </tr>) :
                            <tr>
                                <td colSpan={5} className="text-center">No hay cuentas de banco asociadas a este local</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </section>
        </>
    );
}