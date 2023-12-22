import { useEffect, useState } from "react";
import Select from "react-select";
import { getStores } from "../../helpers/stores";

const StoresSelect = ({
    id = "",
    name = "",
    placeholder = "Selecciona el local",
    noOptionsMessage = "No hay coincidencias",
    query = "",
    value = null,
    onChange = () => null,
}) => {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storesResponse,] = await Promise.all([ getStores("paginated=no"), ]);

                if (storesResponse) setStores(storesResponse.map(({ name, id }) => ({ label: name, value: name })));

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
            options={stores}
            placeholder={placeholder}
            value={value}
            noOptionsMessage={() => noOptionsMessage}
            onChange={(value) => onChange(value)}
            isClearable
        />
    )
}

export default StoresSelect;