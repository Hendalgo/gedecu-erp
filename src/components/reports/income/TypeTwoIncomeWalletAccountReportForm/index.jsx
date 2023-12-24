import { useContext, useState } from "react";
import DecimalInput from "../../../DecimalInput";
import NumberInput from "../../../NumberInput";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { SessionContext } from "../../../../context/SessionContext";

const TypeTwoIncomeWalletAccountReportForm = () => {
    const [amount, setAmount] = useState(0);
    const [rate, setRate] = useState(0);
    const { handleSubmit, setError } = useContext(ReportTableContext);
    const { session } = useContext(SessionContext);

    const handleAmountChange = (amount) => {
        setAmount(amount);
    }

    const handleRateChange = (rate) => {
        setRate(rate)
    }

    const handleLocalSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let errors = [];

        try {
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
        setAmount(0);
        setRate(0);
    }

    const conversion = rate > 0 ? (amount * rate).toLocaleString("es-VE", {
        useGrouping: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) : 0;

    return(
        <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="transferences" className="form-label">N° de transferencias <span className="Required">*</span></label>
                    <NumberInput id="transferences" name="transferences"/>
                </div>
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" onChange={handleAmountChange} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="rate" className="form-label">Tasa <span className="Required">*</span></label>
                    <DecimalInput id="rate" name="rate" onChange={handleRateChange} />
                </div>
                <div className="col">
                    <label htmlFor="conversion" className="form-label">Monto total en { session.name }</label>
                    <input type="text" id="conversion" name="conversion" value={conversion} readOnly className="form-control" />
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

export default TypeTwoIncomeWalletAccountReportForm;