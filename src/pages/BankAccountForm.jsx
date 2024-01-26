import { useContext, useEffect, useState } from "react";
import DecimalInput from "../components/DecimalInput";
import { useNavigate, useParams } from "react-router-dom";
import { SessionContext } from "../context/SessionContext";
import { DASHBOARD_ROUTE, HOME_ROUTE, STORES_ROUTE } from "../consts/Routes";
import { getBanks } from "../helpers/banks";
import { getCurrencies } from "../helpers/currencies";
import Select from "react-select";
import { Alert } from "react-bootstrap";
import { createBankAccount } from "../helpers/banksAccounts";

export default function BankAccountForm() {
    const [banks, setBanks] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({messages: [], variant: "danger"});
    const {session} = useContext(SessionContext);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const [banksResponse, currenciesResponse] = await Promise.all([getBanks("paginated=no"), getCurrencies("paginated=no")]);
            setBanks(banksResponse.map(({id, name}) => ({label: name, value: id})));
            setCurrencies(currenciesResponse.map(({id, name, shortcode}) => ({label: `${name} (${shortcode})`, value: id})));
        }

        if (![1, 3].includes(session.role_id)) {
            navigate(`/${DASHBOARD_ROUTE}/${HOME_ROUTE}`);
        }

        fetchData();
    }, [session.role_id]);

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setLoading(true);
        let errors = [];
        setAlert((prev) => ({...prev, messages: []}));

        const form = new FormData(ev.target);
        
        try {
            if (!form.get("name")) errors.push("El campo Nombre es obligatorio");
            if (!form.get("identifier")) errors.push("El campo Identificador es obligatorio");
            if (!form.get("bank_id")) errors.push("El campo Banco es obligatorio");
            if (!form.get("currency_id")) errors.push("El campo Moneda es obligatorio");
            if (!form.get("balance")) errors.push("El campo Monto inicial es obligatorio");
    
            if (errors.length > 0) throw new Error(errors.join(";"));

            let balance = form.get("balance");

            balance = new Number(balance.replace(/\D/g, "")) / 100;
            form.set("balance", balance);
    
            const response = await createBankAccount(form);

            if (response.status === 201) {
                setAlert({messages: ["Cuenta registrada exitosamente"], variant: "success"});
                navigate(`/${DASHBOARD_ROUTE}/${STORES_ROUTE}/${params.storeId}`);
            }
        } catch (error) {
            let errorMessages = [];

            if (error.response) {
                const {errors, message} = error.response.data;
                if (errors) errorMessages.push(Object.values(errors).flat());
                else errorMessages.push([message]);
            } else {
                errorMessages = error.message.split(";");
            }
            setAlert({messages: errorMessages, variant: "danger"});
        }
        setLoading(false);
    }
    return (
        <>
            <section className="p-3">
                <span className='ModalTopTitle'>Registrar nueva cuenta bancaria</span>
                <br />
                <span className='ModalTopSubTitle'>Esta pestaña le permite registrar una nueva cuenta bancaria o de alguna otra plataforma monetaria al local asignado.</span>
            </section>
            <section className="p-3 rounded" style={{backgroundColor: "#ECF3FB"}}>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="name" className="form-label">Nombre <span className="Required">*</span></label>
                            <input type="text" name="name" id="name" className="form-control" placeholder="Nombre y apellido" />
                        </div>
                        <div className="col">
                            <label htmlFor="identifier" className="form-label">Identificador <span className="Required">*</span></label>
                            <input type="text" name="identifier" id="identifier" className="form-control" placeholder="00000000; mail@example.com" />
                        </div>
                        <div className="col">
                            <label htmlFor="bank" className="form-label">Banco <span className="Required">*</span></label>
                            <Select inputId="bank" name="bank_id" options={banks} placeholder="Seleccione un banco" noOptionsMessage={() => "No hay coincidencias"} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="currency" className="form-label">Moneda <span className="Required">*</span></label>
                            <Select inputId="currency" name="currency_id" options={currencies} placeholder="Seleccione una moneda" noOptionsMessage={() => "No hay coincidencias"} />
                        </div>
                        <div className="col">
                            <label htmlFor="balance" className="form-label">Monto inicial <span className="Required">*</span></label>
                            <DecimalInput id="balance" name="balance" />
                        </div>
                    </div>
                    <Alert show={alert.messages.length > 0} variant={alert.variant}>
                        <ul>
                            {
                                alert.messages.map((message, index) => <li key={index}>{message}</li>)
                            }
                        </ul>
                    </Alert>
                    <div className="container text-end">
                        <input type="submit" value="Guardar" className="btn btn-primary" disabled={loading} />
                    </div>
                </form>
            </section>
        </>
    );
}