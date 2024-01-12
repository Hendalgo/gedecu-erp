import { Alert, Card, Form } from "react-bootstrap";
import Select from "react-select";
import DecimalInput from "../components/DecimalInput/index";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import BanksSelect from "../components/BanksSelect";
import { getCurrencies } from "../helpers/currencies";
import StoresSelect from "../components/StoresSelect";
import BankAccountsSelect from "../components/BankAccountsSelect";
import { SessionContext } from "../context/SessionContext";

const formsByCurrencyMap = new Map();
formsByCurrencyMap.set(1, <BolivarsForm />);
formsByCurrencyMap.set(2, <OthersForm />);

export default function DuplicateReportForm() {
    const [currency, setCurrency] = useState(0);
    const [message, setMessage] = useState(null);
    const { session } = useContext(SessionContext);
    const params = useParams();
    // console.log(params)

    useEffect(() => {
        if (session.role_id !== 1) {
            // redirect
        }
        // Buscar la data del duplicado
    }, []);

    const handleRadioChange = ({ target }) => {
        setCurrency(parseInt(target.value));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage(null);
        const errors = [];
        try {
            const formData = new FormData(e.target);
            formData.forEach((val, key) => console.log(key, val));

            if (formData.has("store") && !formData.get("store")) errors.push("El campo Local es obligatorio");
            if (formData.has("account") && !formData.get("account")) errors.push("El campo Cuenta es obligatorio");
            if (formData.has("amount") && formData.get("amount") === "0,00") errors.push("El campo Monto es obligatorio");

            if (errors.length > 0) throw new Error(errors.join(";"));

        } catch ({ message }) {
            setMessage({ message: message.split(";"), variant: "danger" });
        }
    }

    return (
        <>
            <section className="mb-3">
                {/* Welcome and report general data (Id and date) */}
            </section>
            <section className="row">
                <div className="col-7">
                    <Card>
                        <Card.Header>Datos de recuperación</Card.Header>
                        <form onSubmit={handleSubmit}>
                            <Card.Body>
                                <div className="row">
                                    <div className="col">
                                        <Form.Check type="radio" id="bolivars" name="currencies" value={1} label="Bolívares" inline onChange={handleRadioChange} />
                                        <Form.Check type="radio" id="others" name="currencies" value={2} label="Otros" inline onChange={handleRadioChange} />
                                    </div>
                                </div>
                                {
                                    formsByCurrencyMap.has(currency) && formsByCurrencyMap.get(currency)
                                }
                                <Alert show={message} variant={message?.variant} className="mt-3">
                                    <ul>
                                        {
                                            message && message.message.map((message, index) => {
                                                return <li key={index}>{message}</li>
                                            })
                                        }
                                    </ul>
                                </Alert>
                            </Card.Body>
                            <Card.Footer className="text-end">
                                <input type="submit" value="Verificar" className="col-4 btn btn-success" disabled={currency == 0 || false} />
                            </Card.Footer>
                        </form>
                    </Card>
                </div>
                <div className="col-5">
                    <Card>
                        <Card.Body>
                            <div className="row">
                                <div className="col">
                                    <h6 style={{color: "#6C7DA3", fontSize: "12px", fontWeight: 600}}>RESPONSABLE:</h6>
                                    <p style={{color: "#495057", fontSize: "16px", fontWeight: 600}}></p>
                                </div>
                                <div className="col"></div>
                            </div>
                            <div className="row">
                                <div className="col"></div>
                                <div className="col"></div>
                            </div>
                            <div className="row">
                                <div className="col"></div>
                                <div className="col"></div>
                            </div>
                            <div className="row">
                                <div className="col"></div>
                                <div className="col"></div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </section>
        </>
    )
}

function BolivarsForm() {
    const [bank, setBank] = useState(null);

    return (
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="bank_id" className="form-label">Banco</label>
                    <BanksSelect id="bank" query="&country=2" value={bank} onChange={setBank} />
                </div>
                <div className="col">
                    <label htmlFor="account" className="form-label">Cuenta <span className="Required">*</span></label>
                    <BankAccountsSelect id="account" name="account" query={`&bank=${bank?.value || 0}`} disabled={!bank} />
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
                </div>
            </div>
        </>
    )
}

function OthersForm() {
    const [currencies, setCurrencies] = useState([]);
    const [currency, setCurrency] = useState(null);
    const [store, setStore] = useState(null);
    const [account, setAccount] = useState(null);
    
    const paymentMethods = useRef([
        {label: "Efectivo", value: 1},
        {label: "Transferencia", value: 2},
    ]);
    
    const [paymentMethod, setPaymentMethod] = useState(paymentMethods.current.at(0));

    useEffect(() => {
        const fetchData = async () => {
            const [currenciesResponse] = await Promise.all([getCurrencies("paginated=no")]);
            if (currenciesResponse) setCurrencies(currenciesResponse.map(({name, shortcode, id}) => ({label: `${name} (${shortcode})`, value: id})));
        }

        fetchData();
    }, []);

    const handlePaymentMethodChange = (option) => {
        setPaymentMethod(option);
    }

    return (
        <>
            <div className="row">
                <div className="col">
                    <label htmlFor="currency" className="form-label">Divisa</label>
                    <Select inputId="currency" options={currencies} placeholder="Seleccione una divisa" onChange={setCurrency} noOptionsMessage={() => "No hay coincidencias"} />
                </div>
                <div className="col">
                    <label htmlFor="paymentMethod" className="form-label">Medio de pago</label>
                    <Select inputId="paymentMethod" options={paymentMethods.current} value={paymentMethod} onChange={handlePaymentMethodChange} noOptionsMessage={() => "No hay coincidencias"} />
                </div>
            </div>
            {
                paymentMethod.value === 1 &&
                <div className="row mt-3">
                    <div className="col">
                        <label htmlFor="store_id" className="form-label">Local <span className="Required">*</span></label>
                        <StoresSelect id="store" name="store" value={store} onChange={setStore} query={`&currency=${currency?.value || 0}`} disabled={!currency} />
                    </div>
                </div>
            }
            {
                paymentMethod.value === 2 &&
                <div className="row mt-3">
                    <div className="col">
                        <label htmlFor="account_id" className="form-label">Cuenta <span className="Required">*</span></label>
                        <BankAccountsSelect id="account" name="account" value={account} onChange={setAccount} query={`&currency=${currency?.value || 0}`} disabled={!currency} />
                    </div>
                    <div className="col">
                        <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                        <DecimalInput id="amount" name="amount" />
                    </div>
                </div>
            }
        </>
    )
}