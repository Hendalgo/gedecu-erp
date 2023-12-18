import DecimalInput from "../../../DecimalInput";

const TypeTwoCashReportForm = () => {
    return(
        <>
            <div className="row">
                <div className="col-6">
                    <label htmlFor="">Depósito o entrega <span className="Required">*</span></label>
                </div>
                <div className="col-6">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
                </div>
            </div>
        </>
    )
}

export default TypeTwoCashReportForm;