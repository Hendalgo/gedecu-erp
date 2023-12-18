import { useState } from "react";
import DecimalInput from "../../../DecimalInput";
import BankAccountsSelect from "../../../BankAccountsSelect";
import StoresSelect from "../../../StoresSelect";
import NumberInput from "../../../NumberInput";

const StoreReportForm = () => {
    const [amount, setAmount] = useState(0);
    const [rate, setRate] = useState(0);

    const handleAmountChange = (amount) => {
        if (Number.isNaN(amount)) console.error("Ingrese un valor adecuado");
        else setAmount(amount);
    }

    const handleRateChange = (rate) => {
        if (Number.isNaN(rate)) console.error("Ingrese un valor adecuado");
        else setRate(rate);
    }

    const conversionAmount = rate > 0 ? (amount * rate).toFixed(2) : 0;

    return(
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="store" className="form-label">Local <span className="Required">*</span></label>
                    <StoresSelect id="store" name="store" />
                </div>
                <div className="col">
                    <label htmlFor="senderAccount" className="form-label">Cuenta emisora <span className="Required">*</span></label>
                    <BankAccountsSelect id="senderAccount" name="senderAccount" placeholder="Selecciona la cuenta emisora" />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="transferencesQuantity" className="form-label">N° de transferencias <span className="Required">*</span></label>
                    <NumberInput id="transferencesQuantity" name="transferencesQuantity" />
                </div>
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto total en COP <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" defaultValue={amount} onChange={handleAmountChange} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <label htmlFor="rate" className="form-label">Tasa de cambio <span className="Required">*</span></label>
                    <DecimalInput id="rate" name="rate" defaultValue={rate} onChange={handleRateChange} />
                </div>
                <div className="col">
                    <label htmlFor="conversion" className="form-label">Monto total en VED</label>
                    <input id="conversion" name="conversion" value={conversionAmount} readOnly className="form-control" />
                </div>
            </div>
        </>
    )
}

export default StoreReportForm;