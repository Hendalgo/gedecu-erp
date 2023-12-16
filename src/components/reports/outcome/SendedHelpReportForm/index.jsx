import Select from "react-select";
import DecimalInput from "../../../DecimalInput";
import { useEffect, useState } from "react";
import { getBankAccounts } from "../../../../helpers/banksAccounts";
import { getUsers } from "../../../../helpers/users";

const SendedHelpReportForm = () => {
    const [bankAccounts, setBankAccounts] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse, banksAccountsResponse] = await Promise.all([ getUsers("paginated=no"), getBankAccounts("paginated=no"), ]);

                if (banksAccountsResponse) setBankAccounts(banksAccountsResponse.map(({ name, id }) => ({ label: name, value: id })));

                if (usersResponse) setUsers(usersResponse.map(({ name, id }) => ({ label: name, value: id })));

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
                    <label htmlFor="user" className="form-label">Gestor <span className="Required">*</span></label>
                    <Select
                        inputId="user"
                        options={users}
                        placeholder="Selecciona el gestor"
                        noOptionsMessage={() => "No hay coincidencias"}
                    />
                </div>
                <div className="col">
                    <label htmlFor="account" className="form-label">Cuenta emisora <span className="Required">*</span></label>
                    <Select
                        inputId="account"
                        options={bankAccounts}
                        placeholder="Selecciona la cuenta emisora"
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

export default SendedHelpReportForm;