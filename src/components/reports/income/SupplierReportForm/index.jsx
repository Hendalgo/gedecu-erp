import DecimalInput from "../../../DecimalInput";
import BankAccountsSelect from "../../../BankAccountsSelect";
import UsersSelect from "../../../UsersSelect";

const SupplierReportForm = () => {
    return(
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="supplier" className="form-label">Proveedor <span className="Required">*</span></label>
                    <UsersSelect id="supplier" name="supplier" placeholder="Selecciona al proveedor" query="" />
                    {/* <UsersSelect id="supplier" name="supplier" placeholder="Selecciona al proveedor" query="&rol=1" /> */}
                </div>
                <div className="col">
                    <label htmlFor="receiverAccount" className="form-label">Cuenta receptora <span className="Required">*</span></label>
                    <BankAccountsSelect id="receiverAccount" name="receiverAccount" placeholder="Selecciona la cuenta receptora" />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
                </div>
                <div className="col">
                    <label htmlFor="reference" className="form-label">Referencia <span className="Required">*</span></label>
                    <input type="text" id="reference" name="reference" maxLength={20} className="form-control" />
                </div>
            </div>
        </>
    )
}

export default SupplierReportForm;