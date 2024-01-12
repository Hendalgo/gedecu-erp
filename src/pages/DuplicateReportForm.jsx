import { Form } from "react-bootstrap";
import Select from "react-select";
import DecimalInput from "../components/DecimalInput/index";
import { useState } from "react";

export default function DuplicateReportForm() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // e.target.reset();
    }

    return (
        <>
            <section>
                {/* Welcome and report general data (Id and date) */}
            </section>
            <section className="row">
                <div className="col">
                    <h4>Datos de recuperación</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <Form.Check defaultChecked={false} type="radio" id="" name="currency" value={""} className="col-4" label="Bolívares" inline />
                            <Form.Check defaultChecked={false} type="radio" id="" name="currency" value={""} className="col-4" label="Pesos" inline />
                            <Form.Check defaultChecked={false} type="radio" id="" name="currency" value={""} className="col-4" label="Otros" inline />
                        </div>
                        <div className="row">
                            <div className="col text-end">
                                <input type="submit" value="Verificar" className="col-4 btn btn-success" />                            
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col"></div>
            </section>
        </>
    )
}

function BolivarsForm() {
    return (
        <div className="row">
            <div className="col">
                <label htmlFor="" className="form-label">Banco</label>
                <Select />
            </div>
            <div className="col">
                <label htmlFor="" className="form-label">Cuenta</label>
                <Select />
            </div>
        </div>
    )
}

function PesosForm() {
    const [paymentMethod, setPaymentMethod] = useState(null);

    return (
        <>
            <div className="row">
                <div className="col">
                    <label htmlFor="" className="form-label">Local</label>
                    <Select />
                </div>
                <div className="col">
                    <label htmlFor="" className="form-label">Medio de pago</label>
                    <Select onChange={setPaymentMethod} />
                </div>
                </div>
                {
                    false &&
                    <div className="row mt-3">
                        <div className="col">
                            <label htmlFor="" className="form-label">Cuenta</label>
                            <Select />
                        </div>
                        <div className="col">
                            <label htmlFor="" className="form-label">Monto</label>
                            <DecimalInput />
                        </div>
                    </div>
                }
        </>
    )
}

function OthersForm() {
    const [paymentMethod, setPaymentMethod] = useState(null);

    return (
        <>
            <div className="row">
                <div className="col">
                    <label htmlFor="" className="form-label">Divisa</label>
                    <Select />
                </div>
                <div className="col">
                    <label htmlFor="" className="form-label">Medio de pago</label>
                    <Select onChange={setPaymentMethod} />
                </div>
                </div>
                {
                    false &&
                    <div className="row mt-3">
                        <div className="col">
                            <label htmlFor="" className="form-label">Local</label>
                            <Select />
                        </div>
                    </div>
                }
                {
                    false &&
                    <div className="row mt-3">
                        <div className="col">
                            <label htmlFor="" className="form-label">Cuenta</label>
                            <Select />
                        </div>
                        <div className="col">
                            <label htmlFor="" className="form-label">Monto</label>
                            <DecimalInput />
                        </div>
                    </div>
                }
        </>
    )
}