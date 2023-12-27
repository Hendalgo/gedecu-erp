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
    onError = () => null,
}) => {
    const [bankAccounts, setBankAccounts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [banksAccountsResponse] = await Promise.all([ getBankAccounts("paginated=no".concat(query)), ]);

                if (banksAccountsResponse) setBankAccounts(banksAccountsResponse.map(({ name, identifier, currency, id }) => {
                    const label = name.concat(" - ", identifier);
                    return { label: label, value: id, currency_id: currency.id, currency: currency.shortcode, };
                }));

            } catch ({ message, response }) {
                onError({ show: true, message: [response.data.message], variant: "danger", });
            }
        }

        fetchData();
    }, [query])

    return (
        <>
            <input type="hidden" id={id} name={name} value={value?.label || ""} />
            <Select
                inputId={`${id}_id`}
                name={`${name}_id`}
                options={bankAccounts}
                value={value}
                onChange={(value) => onChange(value)}
                placeholder={placeholder}
                noOptionsMessage={() => noOptionsMessage}
                isClearable
            />
        </>
    )
}

export default BankAccountsSelect;