import DecimalInput from "../../../DecimalInput";
import BankAccountsSelect from "../../../BankAccountsSelect";
import NumberInput from "../../../NumberInput";

const IncomeWalletReportForm = () => {
    return(
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="receiverAccount" className="form-label">Cuenta receptora <span className="Required">*</span></label>
                    <BankAccountsSelect id="receiverAccount" name="receiverAccount" placeholder="Selecciona la cuenta receptora" />
                </div>
                <div className="col">
                    <label htmlFor="transferencesQuantity" className="form-label">N° de transferencias <span className="Required">*</span></label>
                    <NumberInput id="transferencesQuantity" name="transferencesQuantity" />
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
                </div>
            </div>
        </>
    )
}

export default IncomeWalletReportForm;