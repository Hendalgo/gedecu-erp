import { useEffect, useState } from "react";
import Select from "react-select";
import { getBanks } from "../../helpers/banks";

const BanksSelect = ({
    id = "",
    name = "",
    placeholder = "Selecciona el banco",
    noOptionsMessage = "No hay coincidencias",
    query = "",
}) => {
    const [banks, setBanks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const banksResponse = await getBanks("paginated=no".concat(query));

            if (banksResponse) setBanks(banksResponse.map(({ id, name, }) => ({ label: name, value: id })))
        }

        fetchData();
    }, []);

    return (
        <Select
            inputId={id}
            name={name}
            options={banks}
            placeholder={placeholder}
            noOptionsMessage={() => noOptionsMessage}
        />
    )
}

export default BanksSelect;