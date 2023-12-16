import { useEffect, useState } from "react";
import { getBankAccounts } from "../../../../helpers/banksAccounts";
import Select from "react-select";
import DecimalInput from "../../../DecimalInput";

const SupplierReportForm = () => {
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
                    <label htmlFor="supplier" className="form-label">Proveedor <span className="Required">*</span></label>
                </div>
                <div className="col">
                    <label htmlFor="account" className="form-label">Cuenta receptora <span className="Required">*</span></label>
                    <Select
                        inputId="account"
                        options={bankAccounts}
                        placeholder="Selecciona la cuenta receptora"
                        noOptionsMessage={() => "No hay coincidencias"}
                    />
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