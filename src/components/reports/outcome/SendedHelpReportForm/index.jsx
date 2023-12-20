import DecimalInput from "../../../DecimalInput";
import UsersSelect from "../../../UsersSelect";
import BankAccountsSelect from "../../../BankAccountsSelect";
import { useContext, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";

const SendedHelpReportForm = () => {
    const [user, setUser] = useState(null);
    const [bankAccount, setBankAccount] = useState(null);
    const { handleSubmit } = useContext(ReportTableContext);

    const handleReset = () => {
        setUser(null);
        setBankAccount(null);
    }

    return(
        <form onSubmit={handleSubmit} onReset={handleReset} autoComplete="off">
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="user" className="form-label">Gestor <span className="Required">*</span></label>
                    <UsersSelect id="user" name="user" value={user} onChange={setUser} />
                </div>
                <div className="col">
                    <label htmlFor="senderAccount" className="form-label">Cuenta emisora <span className="Required">*</span></label>
                    <BankAccountsSelect id="senderAccount" name="senderAccount" value={bankAccount} onChange={setBankAccount} placeholder="Selecciona la cuenta emisora" />
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

export default SendedHelpReportForm;