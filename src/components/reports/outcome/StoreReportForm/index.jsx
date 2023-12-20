import { useContext, useState } from "react";
import DecimalInput from "../../../DecimalInput";
import BankAccountsSelect from "../../../BankAccountsSelect";
import StoresSelect from "../../../StoresSelect";
import NumberInput from "../../../NumberInput";
import { ReportTableContext } from "../../../../context/ReportTableContext";

const StoreReportForm = () => {
    const [amount, setAmount] = useState(0);
    const [rate, setRate] = useState(0);
    const [store, setStore] = useState(null);
    const [bankAccount, setBankAccount] = useState(null);
    const { handleSubmit } = useContext(ReportTableContext);

    const handleAmountChange = (amount) => {
        if (Number.isNaN(amount)) console.error("Ingrese un valor adecuado");
        else setAmount(amount);
    }

    const handleRateChange = (rate) => {
        if (Number.isNaN(rate)) console.error("Ingrese un valor adecuado");
        else setRate(rate);
    }

    const handleReset = () => {
        setAmount(0);
        setRate(0);
        setStore(null);
        setBankAccount(null);
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
                    <label htmlFor="store" className="form-label">Local <span className="Required">*</span></label>
                    <StoresSelect id="store" name="store" value={store} onChange={setStore} />
                </div>
                <div className="col">
                    <label htmlFor="senderAccount" className="form-label">Cuenta emisora <span className="Required">*</span></label>
                    <BankAccountsSelect id="senderAccount" name="senderAccount" value={bankAccount} onChange={setBankAccount} placeholder="Selecciona la cuenta emisora" />
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
                    <label htmlFor="rate" className="form-label">Tasa de cambio <span className="Required">*</span></label>
                    <DecimalInput id="rate" name="rate" defaultValue={rate.toLocaleString("es-VE", {minimumFractionDigits:2})} onChange={handleRateChange} />
                </div>
                <div className="col">
                    <label htmlFor="conversion" className="form-label">Monto total en VED</label>
                    <input id="conversion" name="conversion" value={conversionAmount} readOnly className="form-control" />
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

export default StoreReportForm;