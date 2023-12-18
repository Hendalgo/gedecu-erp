import DecimalInput from "../../../DecimalInput";
import StoresSelect from "../../../StoresSelect";
import BankAccountsSelect from "../../../BankAccountsSelect";

const TypeTwoHelpReportForm = () => {
    return(
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="store">Local <span className="Required">*</span></label>
                    <StoresSelect id="store" name="store" />
                </div>
                <div className="col">
                    <label htmlFor="account">Cuenta <span className="Required">*</span></label>
                    <BankAccountsSelect id="account" name="account" />
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <label htmlFor="amount">Monto en COP <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
                </div>
            </div>
        </>
    )
}

export default TypeTwoHelpReportForm;