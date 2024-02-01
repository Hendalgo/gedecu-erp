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
    onError = () => null,
    disabled = false,
}) => {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storesResponse,] = await Promise.all([ getStores("paginated=no".concat(query)), ]);

                if (storesResponse) setStores(storesResponse.map(({ name, id, country }) => {
                    return { label: name, value: id, currency_id: country.currency.id, currency: country.currency.shortcode, };
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
                options={stores}
                placeholder={placeholder}
                value={value}
                noOptionsMessage={() => noOptionsMessage}
                onChange={(value) => onChange(value)}
                isClearable
                isDisabled={disabled}
            />
        </>
    )
}

export default StoresSelect;