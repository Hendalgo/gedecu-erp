import { useContext, useState } from "react";
import DecimalInput from "../../../DecimalInput";
import UsersSelect from "../../../UsersSelect";
import NumberInput from "../../../NumberInput";
import BanksSelect from "../../../BanksSelect";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { SessionContext } from "../../../../context/SessionContext";
import { Form } from "react-bootstrap";

const TypeOneDraftReportForm = () => {
    const [amount, setAmount] = useState(0);
    const [rate, setRate] = useState(0);
    const [user, setUser] = useState(null);
    const [bank, setBank] = useState(null);
    const { handleSubmit, setError, country } = useContext(ReportTableContext);
    const { session } = useContext(SessionContext);

    const handleAmountChange = (amount) => {
        if (Number.isNaN(amount)) setError({ show: true, message: ["Valor inadecuado."], variant: "danger" });
        else setAmount(amount);
    }

    const handleRateChange = (rate) => {
        if (Number.isNaN(amount)) setError({ show: true, message: ["Valor inadecuado."], variant: "danger" });
        else setRate(rate);        
    }

    const handleLocalSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let errors = [];

        try {
            if (!bank) errors.push("El campo Banco es obligatorio.");
            if (!user) errors.push("El campo Gestor es obligatorio.");
            if (formData.get("transferences") == 0) errors.push("El campo N° de transferencias es obligatorio.");
            if (formData.get("amount") === "0,00") errors.push("El campo Monto es obligatorio.");
            if (formData.get("rate") === "0,00") errors.push("El campo Tasa es obligatorio.");
            
            if (errors.length > 0) throw new Error(errors.join(";"));
            
            handleSubmit(formData);
            
            e.target.reset();
        } catch (error) {
            setError({
                show: true,
                message: error.message.split(";"),
                variant: "danger",
            });
        }
    }

    const handleReset = () => {
        setUser(null);
        setBank(null);
        setAmount(0);
        setRate(0);
    }

    const conversionAmount = rate > 0 ? (amount * rate).toLocaleString("es-VE", {
        useGrouping: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) : 0;

    return(
        <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
            <input type="hidden" id="country_id" name="country_id" value={country?.id_country || session.country_id} />
            <input type="hidden" id="currency_id" name="currency_id" value={country?.currency_id || 0} />
            <input type="hidden" id="currency" name="currency" value={country?.currency || ""} />
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="bank_id" className="form-label">Banco <span className="Required">*</span></label>
                    <BanksSelect
                        id="bank"
                        name="bank"
                        value={bank}
                        onChange={setBank}
                        onError={setError}
                        query="&country=2" />
                </div>
                <div className="col">
                    <label htmlFor="user_id" className="form-label">Gestor <span className="Required">*</span></label>
                    <UsersSelect
                        id="user"
                        name="user"
                        value={user}
                        onError={setError}
                        onChange={setUser} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="transferences-quantity" className="form-label">N° de transferencias <span className="Required">*</span></label>
                    <NumberInput id="transferences-quantity" name="transferences-quantity" />
                </div>
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto total en { country?.currency || session.country_id } <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" defaultValue={amount.toLocaleString("es-VE", {minimumFractionDigits:2})} onChange={handleAmountChange} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="rate" className="form-label">Tasa <span className="Required">*</span></label>
                    <DecimalInput id="rate" name="rate" defaultValue={rate.toLocaleString("es-VE", {minimumFractionDigits:2})} onChange={handleRateChange} />
                </div>
                <div className="col">
                    <label htmlFor="conversion" className="form-label">Monto total en VED</label>
                    <input type="text" id="conversion" name="conversion" value={conversionAmount} readOnly className="form-control" />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col">
                    <Form.Check type="checkbox" id="isDuplicated" name="isDuplicated" label="Duplicado" />
                </div>
            </div>
            <div className="row text-end">
                <div className="col">
                    <button type="submit" className="btn btn-outline-primary">Agregar</button>
                </div>
            </div>
        </form>
    )
}

export default TypeOneDraftReportForm;