import DecimalInput from "../../../DecimalInput";
import StoresSelect from "../../../StoresSelect";
import BankAccountsSelect from "../../../BankAccountsSelect";
import { useContext, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";

const TypeTwoHelpReportForm = () => {
    const [store, setStore] = useState(null);
    const [bankAccount, setBankAccount] = useState(null);
    const { handleSubmit, setError } = useContext(ReportTableContext);

    const handleLocalSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let errors = [];

        try {
            if (!store) errors.push("El campo Local es obligatorio.");
            if (!bankAccount) errors.push("El campo Cuenta es obligatorio.");
            if (formData.get("amount") === "0,00") errors.push("El campo Monto es obligatorio.");
            
            if (errors.length > 0) throw new Error(errors.join(";"));
            
            formData.append("store", store.label);
            formData.append("account", bankAccount.label);

            handleSubmit(formData);
            
            e.target.reset();
        } catch (error) {
            setError({
                show: true,
                message: error.message.split(";"),
                variant: "danger",
            });
        }
    }

    const handleReset = () => {
        setStore(null);
        setBankAccount(null);
    }

    return (
        <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="store_id">Local <span className="Required">*</span></label>
                    <StoresSelect id="store_id" name="store_id" value={store}  onChange={setStore} />
                </div>
                <div className="col">
                    <label htmlFor="account_id">Cuenta <span className="Required">*</span></label>
                    <BankAccountsSelect id="account_id" name="account_id" value={bankAccount} onChange={setBankAccount} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="amount">Monto <span className="Required">*</span></label>
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