import DecimalInput from "../../../DecimalInput";
import BankAccountsSelect from "../../../BankAccountsSelect";

const CreditReportForm = () => {
    return(
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="account" className="form-label">Cuenta <span className="Required">*</span></label>
                    <BankAccountsSelect id="account" name="account" />
                </div>
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
                </div>
            </div>
        </>
    )
}

export default CreditReportForm;