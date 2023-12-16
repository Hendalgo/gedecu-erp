import Select from "react-select";
import DecimalInput from "../../../DecimalInput";
import { useEffect, useState } from "react";
import { getBankAccounts } from "../../../../helpers/banksAccounts";

const OtherReportForm = () => {
    const [bankAccounts, setBankAccounts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [banksAccountsResponse] = await Promise.all([ getBankAccounts("paginated=no"), ]);

                if (banksAccountsResponse) setBankAccounts(banksAccountsResponse.map(({ name, id }) => ({ label: name, value: id })));

            } catch (error) {
                console.error(error)
            }
        }

        fetchData();
    }, [])

    return(
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="account" className="form-label">Cuenta emisora <span className="Required">*</span></label>
                    <Select
                        inputId="account"
                        options={bankAccounts}
                        placeholder="Selecciona la cuenta emisora"
                        noOptionsMessage={() => "No hay coincidencias"}
                    />
                </div>
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <label htmlFor="motive" className="form-label">Motivo <span className="Required">*</span></label>
                    <textarea id="motive" name="motive" rows={5} className="form-control"></textarea>

                </div>

            </div>
        </>
    )
}

export default OtherReportForm;