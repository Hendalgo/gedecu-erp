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
    onChange = () => null,
}) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse,] = await Promise.all([ getUsers("paginated=no".concat(query)), ]);

                if (usersResponse) setUsers(usersResponse.map(({ name, email, id }) => ({ label: name.concat(" (", email, ")"), value: id })));

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
            options={users}
            placeholder={placeholder}
            value={value}
            noOptionsMessage={() => noOptionsMessage}
            onChange={(value) => onChange(value)}
            isClearable
        />
    )
}

export default UsersSelect;