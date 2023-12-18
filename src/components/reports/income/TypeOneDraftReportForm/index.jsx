import { useState } from "react";
import DecimalInput from "../../../DecimalInput";
import BankAccountsSelect from "../../../BankAccountsSelect";
import UsersSelect from "../../../UsersSelect";
import NumberInput from "../../../NumberInput";

const TypeOneDraftReportForm = () => {
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
                    <label htmlFor="account" className="form-label">Cuenta <span className="Required">*</span></label>
                    <BankAccountsSelect id="account" name="account" query="&bank=2" />
                </div>
                <div className="col">
                    <label htmlFor="user" className="form-label">Gestor <span className="Required">*</span></label>
                    <UsersSelect id="user" name="user" />
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
                    <label htmlFor="rate" className="form-label">Tasa <span className="Required">*</span></label>
                    <DecimalInput id="rate" name="rate" defaultValue={rate} onChange={handleRateChange} />
                </div>
                <div className="col">
                    <label htmlFor="conversion" className="form-label">Monto total en VED</label>
                    <input type="text" id="conversion" name="conversion" value={conversionAmount} readOnly className="form-control" />
                </div>
            </div>
        </>
    )
}

export default TypeOneDraftReportForm;