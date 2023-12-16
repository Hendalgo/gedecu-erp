import Select from "react-select";
import DecimalInput from "../../../DecimalInput";
import { useEffect, useState } from "react";
import { getBankAccounts } from "../../../../helpers/banksAccounts";

const OutcomeWalletReportForm = () => {
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
                    <label htmlFor="senderAccount" className="form-label">Cuenta emisora <span className="Required">*</span></label>
                    <Select
                        inputId="senderAccount"
                        options={bankAccounts}
                        placeholder="Selecciona la cuenta emisora"
                        noOptionsMessage={() => "No hay coincidencias"}
                    />
                </div>
                <div className="col">
                    <label htmlFor="transferencesAmount" className="form-label">N de transferencias <span className="Required">*</span></label>
                    <input type="number" id="transferencesAmount" name="transferencesAmount" min={1} className="form-control" />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="amount" className="form-label">Monto total <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
                </div>
            </div>
        </>
    )
}

export default OutcomeWalletReportForm;