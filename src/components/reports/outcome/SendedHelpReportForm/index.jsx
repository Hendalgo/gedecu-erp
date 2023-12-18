import DecimalInput from "../../../DecimalInput";
import UsersSelect from "../../../UsersSelect";
import BankAccountsSelect from "../../../BankAccountsSelect";

const SendedHelpReportForm = () => {
    return(
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="user" className="form-label">Gestor <span className="Required">*</span></label>
                    <UsersSelect id="user" name="user" />
                </div>
                <div className="col">
                    <label htmlFor="senderAccount" className="form-label">Cuenta emisora <span className="Required">*</span></label>
                    <BankAccountsSelect id="senderAccount" name="senderAccount" placeholder="Selecciona la cuenta emisora" />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="amount" className="form-label">Monto total <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
                </div>
            </div>
        </>
    )
}

export default SendedHelpReportForm;