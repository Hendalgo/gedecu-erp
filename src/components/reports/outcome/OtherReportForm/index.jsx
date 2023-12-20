import DecimalInput from "../../../DecimalInput";
import BankAccountsSelect from "../../../BankAccountsSelect";
import { useContext, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";

const OtherReportForm = () => {
    const [bankAccount, setBankAccount] = useState(null);
    const { handleSubmit } = useContext(ReportTableContext);

    const handleReset = () => {
        setBankAccount(null);
    }

    return(
        <form onSubmit={handleSubmit} onReset={handleReset} autoComplete="off">
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="account" className="form-label">Cuenta <span className="Required">*</span></label>
                    <BankAccountsSelect id="account" name="account" value={bankAccount} onChange={setBankAccount} />
                </div>
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="motive" className="form-label">Motivo <span className="Required">*</span></label>
                    <textarea id="motive" name="motive" rows={5} className="form-control"></textarea>
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

export default OtherReportForm;