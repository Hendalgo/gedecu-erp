import DecimalInput from "../../../DecimalInput";
import { useContext, } from "react";
import { Form } from "react-bootstrap";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { SessionContext } from "../../../../context/SessionContext";

const TypeTwoWalletAccountReportForm = () => { // Reporte 2 > Egreso > Cuenta Billetera Efectivo
    const { handleSubmit, setError, country, } = useContext(ReportTableContext);
    const { session } = useContext(SessionContext);

    const handleLocalSubmit = (e) => {
        e.preventDefault();
        let errors = [];

        const data = new FormData(e.target);

        try {
            if (data.get("amount") === "0,00") errors.push("El campo Monto es obligatorio.");

            if (errors.length > 0) throw new Error(errors.join(";"));

            handleSubmit(data);
    
            e.target.reset();
        } catch (error) {
            setError({ show: true, message: error.message.split(";"), variant: "danger", });
        }
    }

    return(
        <form onSubmit={handleLocalSubmit}>
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" onChange={() => null} />
                </div>
                <input type="hidden" name="currency_id" value={country?.currency_id || session.country.currency.id} />
                <input type="hidden" name="currency" value={country?.currency || session.country.currency.shortcode} />
            </div>
            {/* <div className={`row mb-3 ${paymentMethod.value !== 2 ? 'd-none' : 'd-block'}`}>
                <div className="col-6">
                    <input type="hidden" name="account" value={bankAccount?.label || ""} />
                    <label htmlFor="account_id" className="form-label">Cuenta <span className="Required">*</span></label>
                    <Select
                        inputId="account_id"
                        name="account_id"
                        options={bankAccounts}
                        value={bankAccount}
                        placeholder="Selecciona la cuenta"
                        noOptionsMessage={() => "No hay coincidencias"}
                        onChange={setBankAccount}
                    />
                </div>
            </div> */}
            <div className="row mb-3">
                <div className="col-6">
                    <Form.Check id="isDuplicated" name="isDuplicated" label={`Duplicado`} />
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

export default TypeTwoWalletAccountReportForm;