import { useState } from "react";
import DecimalInput from "../../../DecimalInput";
import { Alert } from "react-bootstrap";
import NumberInput from "../../../NumberInput";

const TypeOneWalletReportForm = () => {
    const [amount, setAmount] = useState(0);
    const [rate, setRate] = useState(0);
    const [error, setError] = useState({ show: false, message: "", variant: "danger" });

    const handleAmountChange = (amount) => {
        if (Number.isNaN(amount)) setError((prev) => ({ ...prev, show: true, message: "El valor ingresado es inadecuado." }));
        else setAmount(amount);
    }

    const handleRateChange = (rate) => {
        if (Number.isNaN(rate)) setError((prev) => ({ ...prev, show: true, message: "El valor ingresado es inadecuado." }));
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
                    <label htmlFor="transferencesQuantity" className="form-label">N° de transferencias <span className="Required">*</span></label>
                    <NumberInput id="transferencesQuantity" name="transferencesQuantity" />
                </div>
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto total en USD <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" defaultValue={amount} onChange={handleAmountChange} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="rate" className="form-label">Tasa <span className="Required">*</span></label>
                    <DecimalInput id="rate" name="rate" defaultValue={rate} onChange={handleRateChange} />
                </div>
                <div className="col">
                    <label htmlFor="conversion" className="form-label">Monto total en COP</label>
                    <input type="text" id="conversion" name="conversion" value={conversionAmount} readOnly className="form-control" />
                </div>
            </div>
            {
                error.show &&
                <div className="row">
                    <div className="col">
                        <Alert show={error.show} variant={error.variant}>
                            {
                                error.message
                            }
                        </Alert>
                    </div>
                </div>
            }
        </>
    )
}

export default TypeOneWalletReportForm;