import Select from "react-select";
import DecimalInput from "../../../DecimalInput";
import { useEffect, useState } from "react";
import { getBankAccounts } from "../../../../helpers/banksAccounts";
import { getUsers } from "../../../../helpers/users";

const TransferReportForm = () => { // => Reporte de traspasos
    const [senderAccounts, setSenderAccounts] = useState([]);
    const [receiverAccounts, setReceiverAccounts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [banksAccountsResponse] = await Promise.all([ getUsers("paginated=no"), getBankAccounts("paginated=no"), ]);

                if (banksAccountsResponse) {
                    const senderAccounts = banksAccountsResponse.map(({ name, id }) => ({ label: name, value: id }));

                    setSenderAccounts(senderAccounts);

                    // setReceiverAccounts(banksAccountsResponse
                    //     .filter(({ id }) => senderAccounts.every(({ value }) => value !== id))
                    //     .map(() => {}));
                }
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
                        options={senderAccounts}
                        placeholder="Selecciona la cuenta emisora"
                        noOptionsMessage={() => "No hay coincidencias"}
                    />
                </div>
                <div className="col">
                    <label htmlFor="receiverAccount" className="form-label">Cuenta receptora <span className="Required">*</span></label>
                    <Select
                        inputId="receiverAccount"
                        options={receiverAccounts}
                        placeholder="Selecciona la cuenta receptora"
                        noOptionsMessage={() => "No hay coincidencias"}
                    />
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

export default TransferReportForm;