import { FormCheck } from "react-bootstrap";
import DecimalInput from "../../../DecimalInput";
import { useContext } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";

const TypeTwoCashReportForm = () => {
    const { handleSubmit } = useContext(ReportTableContext);

    return(
        <form onSubmit={handleSubmit} autoComplete="off">
            <div className="row mb-3">
                <div className="col">
                    <FormCheck defaultChecked id="deposit" name="isDeliveryOrDeposit" value="Depósito" inline type="radio" label="Depósito" />
                    <FormCheck id="delivery" name="isDeliveryOrDeposit" inline value="Entrega" type="radio" label="Entrega" />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
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

export default TypeTwoCashReportForm;