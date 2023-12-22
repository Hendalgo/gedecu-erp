import { useEffect, useState } from "react";
import { getBankAccounts } from "../../helpers/banksAccounts";
import Select from "react-select";

const BankAccountsSelect = ({
    id = "",
    name = "",
    placeholder = "Selecciona la cuenta de banco",
    noOptionsMessage = "No hay coincidencias",
    query = "",
    value = null,
    onChange = () => null,
}) => {
    const [bankAccounts, setBankAccounts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [banksAccountsResponse] = await Promise.all([ getBankAccounts("paginated=no".concat(query)), ]);

                if (banksAccountsResponse) setBankAccounts(banksAccountsResponse.map(({ name, identifier, id }) => {
                    const label = name.concat(" - ", identifier);
                    return { label: label, value: label };
                }));

            } catch (error) {
                console.error(error)
            }
        }

        fetchData();
    }, [query])

    return (
        <Select
            inputId={id}
            name={name}
            options={bankAccounts}
            value={value}
            onChange={(value) => onChange(value)}
            placeholder={placeholder}
            noOptionsMessage={() => noOptionsMessage}
            isClearable
        />
    )
}

export default BankAccountsSelect;