import DecimalInput from "../../../DecimalInput";
import UsersSelect from "../../../UsersSelect";

const TypeTwoIncomeTransferenceReportForm = () => {
    return(
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="user" className="form-label">Gestor <span className="Required">*</span></label>
                    <UsersSelect
                        id="user"
                        name="user"
                    />
                </div>
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
                </div>
            </div>
        </>
    )
}

export default TypeTwoIncomeTransferenceReportForm;