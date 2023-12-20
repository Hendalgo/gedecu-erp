import { useContext, useEffect, useState } from "react";
import DecimalInput from "../../../DecimalInput";
import NumberInput from "../../../NumberInput";
import { me } from "../../../../helpers/me";
import { ReportTableContext } from "../../../../context/ReportTableContext";

const TypeTwoIncomeWalletAccountReportForm = () => {
    const [amount, setAmount] = useState(0);
    const [rate, setRate] = useState(0);
    const [currencyShortCode, setCurrencyShortCode] = useState("COP");
    const { handleSubmit } = useContext(ReportTableContext);

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
        <form onSubmit={handleSubmit} onReset={handleReset} autoComplete="off">
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
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="rate" className="form-label">Tasa <span className="Required">*</span></label>
                    <DecimalInput id="rate" name="rate" onChange={handleRateChange} />
                </div>
                <div className="col">
                    <label htmlFor="conversion" className="form-label">Monto total en { currencyShortCode }</label>
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