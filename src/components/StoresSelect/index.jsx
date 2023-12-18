import { useEffect, useState } from "react";
import Select from "react-select";
import { getStores } from "../../helpers/stores";

const StoresSelect = ({
    id = "",
    name = "",
    placeholder = "Selecciona el local",
    noOptionsMessage = "No hay coincidencias"
}) => {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storesResponse,] = await Promise.all([ getStores("paginated=no"), ]);

                if (storesResponse) setStores(storesResponse.map(({ name, id }) => ({ label: name, value: id })));

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
            noOptionsMessage={noOptionsMessage}
        />
    )
}

export default StoresSelect;