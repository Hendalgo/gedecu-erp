import Select from "react-select";
import DecimalInput from "../../../DecimalInput";
import { useEffect, useState } from "react";
import { getBankAccounts } from "../../../../helpers/banksAccounts";

const TypeTwoWalletAccountReportForm = () => {
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
                    <label htmlFor="account" className="form-label">Medio de pago <span className="Required">*</span></label>
                    {/* <Select
                        inputId="account"
                        options={bankAccounts}
                        placeholder="Selecciona la cuenta de banco"
                        noOptionsMessage={() => "No hay coincidencias"}
                    /> */}
                </div>
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" onChange={() => null} />
                </div>
            </div>
        </>
    )
}

export default TypeTwoWalletAccountReportForm;