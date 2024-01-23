import { Alert, Card, Form } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SessionContext } from "../context/SessionContext";
import Welcome from "../components/Welcome";
import { getDuplicateById } from "../helpers/reports";
import formsByCurrencyMap from "../consts/DuplicatedFormsByCurrency";
import DecimalInput from "../components/DecimalInput";

export default function DuplicateReportForm() {
    const [duplicate, setDuplicate] = useState(null);
    const [currency, setCurrency] = useState(0);
    const [message, setMessage] = useState({messages: null, variant: "danger"});
    const { session } = useContext(SessionContext);
    const params = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const {id} = params;
            try {
                const duplicateResponse = await getDuplicateById(id);
                setDuplicate(duplicateResponse);
            } catch ({response}) {
                const {message, error} = response.data;
                let errorMessages = [];
                if (message) errorMessages.push(message);
                console.log(message, error);
                setMessage({messages: errorMessages, variant: "danger"});
            }
        }

        if (session.role_id !== 1) {
            // redirect
        }

        fetchData();
    }, [session.role_id, params]);

    const handleRadioChange = ({ target }) => {
        setMessage((prev) => ({...prev, messages: null}));
        setCurrency(parseInt(target.value));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage((prev) => ({...prev, messages: null}));

        const errors = [];

        try {
            const formData = new FormData(e.target);

            if (formData.has("store") && !formData.get("store")) errors.push("El campo Local es obligatorio");
            if (formData.has("account") && !formData.get("account")) errors.push("El campo Cuenta es obligatorio");
            if (formData.has("amount") && formData.get("amount") === "0,00") errors.push("El campo Monto es obligatorio");
            
            if (errors.length > 0) throw new Error(errors.join(";"));

            const amount = new Number(formData.get("amount").replace(/\D/g, "")) / 100;

            formData.set("amount", amount);

            const data = {};

            for (const [key, value] of formData.entries()) {
                data[key] = value;

            }
            console.log(JSON.stringify(data));

        } catch ({ message }) {
            setMessage({ messages: message.split(";"), variant: "danger" });
        }
    }

    if (!duplicate) return <></>;

    return (
        <>
            <section className="mb-3">
                <Welcome showButton={false} text="Verificar Reporte" />
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
                                {
                                    currency > 0 && <div className="row">
                                        <div className="col-6">
                                            <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                                            <DecimalInput id="amount" name="amount" />
                                        </div>
                                    </div>
                                }
                                <Alert show={message.messages?.length > 0} variant={message.variant} className="mt-3">
                                    <ul>
                                        {
                                            message.messages?.map((message, index) => {
                                                return <li key={index}>{message}</li>
                                            })
                                        }
                                    </ul>
                                </Alert>
                            </Card.Body>
                            <Card.Footer className="text-end">
                                <input type="submit" value="Verificar" className="col-4 btn btn-success" disabled={currency == 0 || duplicate.duplicate_status} />
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
                                    <p style={{color: "#495057", fontSize: "16px", fontWeight: 600}}>{duplicate.report.user.name}</p>
                                </div>
                                <div className="col">
                                    <h6 style={{color: "#6C7DA3", fontSize: "12px", fontWeight: 600}}>FECHA:</h6>
                                    <p style={{color: "#495057", fontSize: "16px", fontWeight: 600}}>{new Date(duplicate.created_at).toLocaleString("es-VE")}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <h6 style={{color: "#6C7DA3", fontSize: "12px", fontWeight: 600}}>MONTO:</h6>
                                    <p style={{color: "#495057", fontSize: "16px", fontWeight: 600}}>{duplicate.currency.shortcode} {duplicate.amount.toLocaleString("es-VE", {minimumFractionDigits: 2})}</p>
                                </div>
                                <div className="col">
                                    <h6 style={{color: "#6C7DA3", fontSize: "12px", fontWeight: 600}}>ID REPORTE:</h6>
                                    <p style={{color: "#495057", fontSize: "16px", fontWeight: 600}}>#{duplicate.id.toString().padStart(6, "0")}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <h6 style={{color: "#6C7DA3", fontSize: "12px", fontWeight: 600}}>MOTIVO:</h6>
                                    <p style={{color: "#495057", fontSize: "16px", fontWeight: 600}}></p>
                                </div>
                                {/* <div className="col"></div> */}
                            </div>
                            {/* <div className="row">
                                <div className="col"></div>
                                <div className="col"></div>
                            </div> */}
                        </Card.Body>
                    </Card>
                </div>
            </section>
        </>
    )
}