import { FormCheck } from "react-bootstrap";
import DecimalInput from "../../../DecimalInput";
import { useContext } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";

const TypeTwoCashReportForm = () => {
    const { handleSubmit, setError } = useContext(ReportTableContext);

    const handleLocalSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let errors = [];

        try {
            if (!formData.has("isDeliveryOrDeposit")) errors.push("Debe indicar si el movimiento es Depósito o Entrega.");
            if (formData.get("amount") === "0,00") errors.push("El campo Monto es obligatorio.");
            
            if (errors.length > 0) throw new Error(errors.join(";"));
            
            handleSubmit(formData);
            
            e.target.reset();
        } catch (error) {
            setError({
                show: true,
                message: error.message.split(";"),
                variant: "danger",
            });
        }
    }

    return(
        <form onSubmit={handleLocalSubmit} autoComplete="off">
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