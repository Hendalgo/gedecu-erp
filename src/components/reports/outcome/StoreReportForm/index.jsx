import { useEffect, useState } from "react";
import { getBankAccounts } from "../../../../helpers/banksAccounts";
import Select from "react-select";
import DecimalInput from "../../../DecimalInput";
import { getStores } from "../../../../helpers/stores";

const StoreReportForm = () => {
    const [bankAccounts, setBankAccounts] = useState([]);
    const [stores, setStores] = useState([]);
    const [amount, setAmount] = useState(0);
    const [rate, setRate] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storesResponse, banksAccountsResponse] = await Promise.all([ getStores("paginated=no"), getBankAccounts("paginated=no"), ]);

                if (storesResponse) setStores(storesResponse.map(({ name, id }) => ({ label: name, value: id })));

                if (banksAccountsResponse) setBankAccounts(banksAccountsResponse.map(({ name, id }) => ({ label: name, value: id })));

            } catch (error) {
                console.error(error)
            }
        }

        fetchData();
    }, [])

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
                    <Select
                        inputId="store"
                        options={stores}
                        placeholder="Selecciona el local"
                        noOptionsMessage={() => "No hay coincidencias"}
                    />
                </div>
                <div className="col">
                    <label htmlFor="senderAccount" className="form-label">Cuenta emisora <span className="Required">*</span></label>
                    <Select
                        inputId="senderAccount"
                        options={bankAccounts}
                        placeholder="Selecciona la cuenta emisora"
                        noOptionsMessage={() => "No hay coincidencias"}
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="transferencesAmount" className="form-label">N de transferencias <span className="Required">*</span></label>
                    <input type="number" id="transferencesAmount" name="transferencesAmount" min={1} className="form-control" />
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
                    <label htmlFor="conversionAmount" className="form-label">Monto total en VED <span className="Required">*</span></label>
                    <input id="conversionAmount" name="conversionAmount" value={conversionAmount} readOnly className="form-control" />
                </div>
            </div>
        </>
    )
}

export default StoreReportForm;