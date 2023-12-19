import { useEffect, useState } from "react";
import DecimalInput from "../../../DecimalInput";
import NumberInput from "../../../NumberInput";
import { me } from "../../../../helpers/me";

const TypeTwoIncomeWalletAccountReportForm = () => {
    const [amount, setAmount] = useState(0);
    const [rate, setRate] = useState(0);
    const [currencyShortCode, setCurrencyShortCode] = useState("COP");

    useEffect(() => {
        me()
        .then(({ data }) => {
            setCurrencyShortCode(data.name);
        })
        .catch((error) => {
            console.error(error)
            // setError((prev) => ({ ...prev, show: true, message: error.message }));
        });
    }, []);

    const handleAmountChange = (amount) => {
        setAmount(amount);
    }

    const handleRateChange = (rate) => {
        setRate(rate)
    }

    const conversion = rate > 0 ? (amount * rate).toLocaleString("es-VE", {
        useGrouping: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) : 0;

    return(
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="transferencesQuantity" className="form-label">N° de transferencias <span className="Required">*</span></label>
                    <NumberInput id="transferencesQuantity" name="transferencesQuantity"/>
                </div>
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" onChange={handleAmountChange} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <label htmlFor="rate" className="form-label">Tasa <span className="Required">*</span></label>
                    <DecimalInput id="rate" name="rate" onChange={handleRateChange} />
                </div>
                <div className="col">
                    <label htmlFor="conversion" className="form-label">Monto total en { currencyShortCode }</label>
                    <input type="text" id="conversion" name="conversion" value={conversion} readOnly className="form-control" />
                </div>
            </div>
        </>
    )
}

export default TypeTwoIncomeWalletAccountReportForm;