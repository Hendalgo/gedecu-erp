import Select from "react-select";
import DecimalInput from "../../../DecimalInput";
import { useEffect, useState } from "react";
import { getUsers } from "../../../../helpers/users";

const TypeTwoIncomeTransferenceReportForm = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse] = await Promise.all([ getUsers("paginated=no"), ]); // Filtrar por país

                if (usersResponse) setUsers(usersResponse.map(({ name, id }) => ({ label: name, value: id })));

            } catch (error) {
                console.error(error)
            }
        }

        fetchData();
    }, [])

    return(
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="user" className="form-label">Gestor <span className="Required">*</span></label>
                    <Select
                        inputId="user"
                        options={users}
                        placeholder="Selecciona el usuario"
                        noOptionsMessage={() => "No hay coincidencias"}
                    />
                </div>
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" onChange={() => null} />
                </div>
            </div>
        </>
    )
}

export default TypeTwoIncomeTransferenceReportForm;