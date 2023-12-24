import { useContext, useState } from "react";
import DecimalInput from "../../../DecimalInput";
import UsersSelect from "../../../UsersSelect";
import { ReportTableContext } from "../../../../context/ReportTableContext";

const TypeTwoDepositReportForm = () => {
    const [user, setUser] = useState(null);
    const { handleSubmit, setError } = useContext(ReportTableContext);

    const handleLocalSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let errors = [];

        try {
            if (!user) errors.push("El campo Gestor es obligatorio.");
            if (formData.get("amount") === "0,00") errors.push("El campo Monto es obligatorio.");
            
            if (errors.length > 0) throw new Error(errors.join(";"));
            
            formData.append("user", user.label);
            
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

    const handleReset = () => {
        setUser(null);
    }

    return(
        <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="user_id" className="form-label">Gestor <span className="Required">*</span></label>
                    <UsersSelect id="user_id" name="user" value={user} onChange={setUser} />
                </div>
                <div className="col">
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

export default TypeTwoDepositReportForm;