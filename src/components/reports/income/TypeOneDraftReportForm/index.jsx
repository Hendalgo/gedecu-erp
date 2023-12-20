import { useContext, useState } from "react";
import DecimalInput from "../../../DecimalInput";
import UsersSelect from "../../../UsersSelect";
import NumberInput from "../../../NumberInput";
import BanksSelect from "../../../BanksSelect";
import { ReportTableContext } from "../../../../context/ReportTableContext";

const TypeOneDraftReportForm = () => {
    const [amount, setAmount] = useState(0);
    const [rate, setRate] = useState(0);
    const [user, setUser] = useState(null);
    const [bank, setBank] = useState(null);
    const { handleSubmit } = useContext(ReportTableContext);

    const handleAmountChange = (amount) => {
        if (Number.isNaN(amount)) console.error("Valor inadecuado");
        else setAmount(amount);
    }

    const handleRateChange = (rate) => {
        if (Number.isNaN(rate)) console.error("Valor inadecuado");
        else setRate(rate);        
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
        <form onSubmit={handleSubmit} onReset={handleReset} autoComplete="off">
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="bank" className="form-label">Banco <span className="Required">*</span></label>
                    <BanksSelect id="bank" name="bank" value={bank} onChange={setBank} query="&country=2" />
                </div>
                <div className="col">
                    <label htmlFor="user" className="form-label">Gestor <span className="Required">*</span></label>
                    <UsersSelect id="user" name="user" value={user} onChange={setUser} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="transferencesQuantity" className="form-label">N° de transferencias <span className="Required">*</span></label>
                    <NumberInput id="transferencesQuantity" name="transferencesQuantity" />
                </div>
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto total en COP <span className="Required">*</span></label>
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
            <div className="row text-end">
                <div className="col">
                    <button type="submit" className="btn btn-outline-primary">Agregar</button>
                </div>
            </div>
        </form>
    )
}

export default TypeOneDraftReportForm;