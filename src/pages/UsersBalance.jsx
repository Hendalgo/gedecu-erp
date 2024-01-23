import { useEffect, useState } from "react";
import FilterTableButtons from "../components/FilterTableButtons";
import SearchBar from "../components/SearchBar";
import Welcome from "../components/Welcome";
import TableLoader from "../components/Loaders/TableLoader";
import PaginationTable from "../components/PaginationTable";
import { getUsersBalance } from "../helpers/users";
import { getCountries } from "../helpers/countries";

export default function UsersBalance() {
    const [users, setUsers] = useState(null);
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState(false);
    const [search, setSearch] = useState("");
    const [offset, setOffset] = useState(1);
    const [alert, setAlert] = useState({ message: null, variant: "danger" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse, countriesResponse] = await Promise.all([getUsersBalance("order=created_at"), getCountries("paginated=no")]);
                setUsers(usersResponse);
                if (countriesResponse) setCountries(countriesResponse.data.filter(({id}) => id !== 2));
            } catch (error) {
                setAlert({message: [error.message], variant: "danger"});
            }
        }

        fetchData();
    }, []);

    const handleSearchSubmit = async (ev) => {
        ev.preventDefault();

        setOffset(1);
        let params = `order=created_at`;
        if (search) params += `&search=${search}`;
        if (country) params += `&country=${country}`;

        try {
            const usersResponse = await getUsersBalance(params);
    
            setUsers(usersResponse);
        } catch (error) {
            setAlert({message: [error.message], variant: "danger"});
        }
    }

    const handleCountryChange = async (countryId) => {
        setOffset(1);

        try {
            const usersResponse = await getUsersBalance(`order=created_at&search=${search}${countryId ? `&country=${countryId}` : ""}`);
            setUsers(usersResponse);
            setCountry(countryId);
        } catch (error) {
            setAlert({message: [error.message], variant: "danger"});
        }
    }

    const handlePagination = async ({selected}) => {
        console.log(selected);
        setOffset(selected + 1);

        let params = `order=created_at&page=${selected + 1}`;

        if (search) params += `&search=${search}`;
        if (country) params += `&country=${country}`;
        console.log(params);

        try {
            const usersResponse = await getUsersBalance(params);
            setUsers(usersResponse);    
        } catch (error) {
            setAlert({message: [error.message], variant: "danger"});
        }
    }

    return (
        <>
            <section>
                <Welcome text="Saldo de usuarios" showButton={false} />
            </section>
            <section className="py-4">
                <form onSubmit={handleSearchSubmit} action='GET' className='form-group row'>
                    <div className='col-8'><FilterTableButtons data={countries} callback={handleCountryChange} /></div>
                    <div className='col-4'><SearchBar text='Usuario' change={setSearch} /></div>
                </form>
            </section>
            <section>
                <div className="mb-4 d-flex justify-content-end">
                    <PaginationTable offset={offset} text='usuarios' quantity={users?.last_page || 1} itemsTotal={users?.total || 0} handleChange={handlePagination} />
                </div>
                {
                    Array.isArray(users?.data) ?
                    <table className="table table-striped TableP">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.data.length > 0 ?
                                users.data.map(({id, user, balance, currency}) => {
                                    return <tr key={id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{`${currency.shortcode} ${balance.toLocaleString("es-VE", {minimumFractionDigits: 2})}`}</td>
                                    </tr>
                                }) :
                                <tr>
                                    <td colSpan={3}>No hay registros</td>
                                </tr>
                            }
                        </tbody>
                    </table> :
                    <div><TableLoader /></div>
                }
            </section>
        </>
    )
}