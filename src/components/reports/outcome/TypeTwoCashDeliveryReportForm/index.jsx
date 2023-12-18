import DecimalInput from "../../../DecimalInput";
import UsersSelect from "../../../UsersSelect";

const TypeTwoCashDeliveryReportForm = () => {
    return(
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="user" className="form-label">Gestor <span className="Required">*</span></label>
                    <UsersSelect id="user" name="user" />
                </div>
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" onChange={() => null} />
                </div>
            </div>
        </>
    )
}

export default TypeTwoCashDeliveryReportForm;