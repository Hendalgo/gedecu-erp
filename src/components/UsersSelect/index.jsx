import { useEffect, useState } from "react";
import Select from "react-select";
import { getUsers } from "../../helpers/users";

const UsersSelect = ({
    id = "",
    name = "",
    placeholder = "Selecciona el gestor",
    noOptionsMessage = "No hay coincidencias",
    query = "",
    value = null,
    disabled = false,
    onChange = () => null,
    onError = () => null,
}) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse,] = await Promise.all([ getUsers("paginated=no".concat(query)), ]);

                if (usersResponse) setUsers(usersResponse.data.map(({ name, email, id }) => {
                    const label = name.concat(" (", email, ")");
                    return { label: label, value: id };
                }));

            } catch ({ message, response }) {
                onError({ show: true, message: [response?.data.message], variant: "danger", })
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
                options={users}
                placeholder={placeholder}
                value={value}
                isDisabled={disabled}
                noOptionsMessage={() => noOptionsMessage}
                onChange={(value) => onChange(value)}
                isClearable
            />
        </>
    )
}

export default UsersSelect;