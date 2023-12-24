import DecimalInput from "../../../DecimalInput";
import BankAccountsSelect from "../../../BankAccountsSelect";
import NumberInput from "../../../NumberInput";
import { useContext, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";

const OutcomeWalletReportForm = () => {
    const [bankAccount, setBankAccount] = useState(null);
    const { handleSubmit, setError } = useContext(ReportTableContext);

    const handleLocalSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let errors = [];

        try {
            if (!bankAccount) errors.push("El campo Cuenta es obligatorio.");
            if (formData.get("transferences") == "0") errors.push("El campo N° de transferencias es obligatorio.");
            if (formData.get("amount") === "0,00") errors.push("El campo Referencia es obligatorio.");
            
            if (errors.length > 0) throw new Error(errors.join(";"));
            
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
        setBankAccount(null);
    }

    return(
        <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="account_id" className="form-label">Cuenta <span className="Required">*</span></label>
                    <BankAccountsSelect id="account_id" name="account_id" value={bankAccount} onChange={setBankAccount} placeholder="Selecciona la cuenta emisora" />
                </div>
                <div className="col">
                    <label htmlFor="transferences" className="form-label">N° de transferencias <span className="Required">*</span></label>
                    <NumberInput id="transferences" name="transferences" />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="amount" className="form-label">Monto total <span className="Required">*</span></label>
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

export default OutcomeWalletReportForm;