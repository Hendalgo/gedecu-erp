import { useEffect, useState } from "react";
import { getBankAccounts } from "../../../../helpers/banksAccounts";
import Select from "react-select";
import DecimalInput from "../../../DecimalInput";

const TypeTwoTransferReportForm = () => { // Reporte de traspaso Tipo 2
    const [bankAccounts, setBankAccounts] = useState([]);
    // Usar ref para manejar el estado original de las cuentas de banco

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

    const handleBankAccountChange = ({ value }, isSender = false) => {
        console.log(isSender)
        console.log(bankAccounts.filter(({ id }) => id !== value))
    }

    return(
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="senderAccount" className="form-label">Cuenta emisora <span className="Required">*</span></label>
                    <Select
                        inputId="senderAccount"
                        name="senderAccount"
                        options={bankAccounts}
                        placeholder="Selecciona la cuenta emisora"
                        noOptionsMessage={() => "No hay coincidencias"}
                        onChange={(event) => handleBankAccountChange(event, true)}
                    />
                </div>
                <div className="col">
                    <label htmlFor="receiverAccount" className="form-label">Cuenta receptora <span className="Required">*</span></label>
                    <Select
                        inputId="receiverAccount"
                        name="receiverAccount"
                        options={bankAccounts}
                        placeholder="Selecciona la cuenta receptora"
                        noOptionsMessage={() => "No hay coincidencias"}
                        onChange={(event) => handleBankAccountChange(event, false)}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <label htmlFor="amount" className="form-label">Monto en COP <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
                </div>
            </div>
        </>
    )
}

export default TypeTwoTransferReportForm;