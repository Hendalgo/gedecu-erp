import { useState } from "react";
import DecimalInput from "../../../DecimalInput";

const TypeOneWalletReportForm = () => {
    const [amount, setAmount] = useState(0);
    const [rate, setRate] = useState(0);

    const handleAmountChange = (amount) => {
        if (Number.isNaN(amount)) console.error("Valor inadecuado");
        else setAmount(amount);
    }

    const handleRateChange = (rate) => {
        if (Number.isNaN(rate)) console.error("Valor inadecuado");
        else setRate(rate);        
    }

    const conversionAmount = rate > 0 ? (amount * rate).toLocaleString("es-VE", {
        useGrouping: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) : 0;

    return(
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="transferencesAmount" className="form-label">N de transferencias <span className="Required">*</span></label>
                    <input type="number" id="transferencesAmount" name="transferencesAmount" min={1} className="form-control" />
                </div>
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto total en USD <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" defaultValue={amount} onChange={handleAmountChange} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <label htmlFor="rate" className="form-label">Tasa <span className="Required">*</span></label>
                    <DecimalInput id="rate" name="rate" defaultValue={rate} onChange={handleRateChange} />
                </div>
                <div className="col">
                    <label htmlFor="conversionAmount" className="form-label">Monto total en COP <span className="Required">*</span></label>
                    <input type="text" id="conversionAmount" name="conversionAmount" value={conversionAmount} readOnly className="form-control" />
                </div>
            </div>
        </>
    )
}

export default TypeOneWalletReportForm;