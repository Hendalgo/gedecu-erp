import DecimalInput from "../../../DecimalInput";
import BankAccountsSelect from "../../../BankAccountsSelect";
import UsersSelect from "../../../UsersSelect";
import { useContext, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";

const ReceivedHelpReportForm = () => {
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
                    <label htmlFor="receiverAccount" className="form-label">Cuenta receptora <span className="Required">*</span></label>
                    <BankAccountsSelect id="receiverAccount" name="receiverAccount" value={bankAccount} onChange={setBankAccount} placeholder="Selecciona la cuenta receptora" />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
                </div>
                <div className="col">
                    <label htmlFor="reference" className="form-label">Referencia <span className="Required">*</span></label>
                    <input type="text" id="reference" name="reference" maxLength={20} className="form-control" />
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

export default ReceivedHelpReportForm;