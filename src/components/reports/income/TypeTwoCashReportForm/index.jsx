import { FormCheck } from "react-bootstrap";
import DecimalInput from "../../../DecimalInput";

const TypeTwoCashReportForm = () => {
    return(
        <>
            <div className="row mb-3">
                <div className="col">
                    <FormCheck id="deposit" name="isDeliveryOrDeposit" inline type="radio" label="Depósito" />
                    <FormCheck id="delivery" name="isDeliveryOrDeposit" inline type="radio" label="Entrega" />
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

export default TypeTwoCashReportForm;