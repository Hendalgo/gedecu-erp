import DecimalInput from "../../../DecimalInput";
import StoresSelect from "../../../StoresSelect";
import BankAccountsSelect from "../../../BankAccountsSelect";
import { useContext, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";

const TypeTwoHelpReportForm = () => {
    const [store, setStore] = useState(null);
    const [bankAccount, setBankAccount] = useState(null);
    const { handleSubmit } = useContext(ReportTableContext);

    const handleReset = () => {
        setStore(null);
        setBankAccount(null);
    }

    return (
        <form onSubmit={handleSubmit} onReset={handleReset} autoComplete="off">
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="store">Local <span className="Required">*</span></label>
                    <StoresSelect id="store" name="store" value={store}  onChange={setStore} />
                </div>
                <div className="col">
                    <label htmlFor="account">Cuenta <span className="Required">*</span></label>
                    <BankAccountsSelect id="account" name="account" value={bankAccount} onChange={setBankAccount} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="amount">Monto en COP <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
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

export default TypeTwoHelpReportForm;