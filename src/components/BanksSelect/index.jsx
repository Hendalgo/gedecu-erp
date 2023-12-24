import { useEffect, useState } from "react";
import Select from "react-select";
import { getBanks } from "../../helpers/banks";

const BanksSelect = ({
    id = "",
    name = "",
    placeholder = "Selecciona el banco",
    noOptionsMessage = "No hay coincidencias",
    query = "",
    value = null,
    onChange = () => null,
}) => {
    const [banks, setBanks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const banksResponse = await getBanks("paginated=no".concat(query));

            if (banksResponse) setBanks(banksResponse.map(({ id, name, }) => ({ label: name, value: id })));
        }

        fetchData();
    }, [query]);

    return (
        <>
            <input type="hidden" id={id} name={name} value={value?.label || ""} />
            <Select
                inputId={`${id}_id`}
                name={`${name}_id`}
                options={banks}
                placeholder={placeholder}
                value={value}
                noOptionsMessage={() => noOptionsMessage}
                onChange={(value) => onChange(value)}
                isClearable
            />
        </>
    )
}

export default BanksSelect;