import { useEffect, useState } from "react";
import { getBankAccounts } from "../../helpers/banksAccounts";
import Select from "react-select";

const BankAccountsSelect = ({
    id = "",
    name = "",
    placeholder = "Selecciona la cuenta de banco",
    noOptionsMessage = "No hay coincidencias",
    query = "",
}) => {
    const [bankAccounts, setBankAccounts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [banksAccountsResponse] = await Promise.all([ getBankAccounts("paginated=no".concat(query)), ]);

                if (banksAccountsResponse) setBankAccounts(banksAccountsResponse.map(({ name, identifier, id }) => ({ label: name.concat(" - ", identifier), value: id })));

            } catch (error) {
                console.error(error)
            }
        }

        fetchData();
    }, [])

    return (
        <Select
            inputId={id}
            name={name}
            options={bankAccounts}
            placeholder={placeholder}
            noOptionsMessage={() => noOptionsMessage}
        />
    )
}

export default BankAccountsSelect;