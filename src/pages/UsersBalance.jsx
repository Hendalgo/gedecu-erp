import { useState } from "react";
import FilterTableButtons from "../components/FilterTableButtons";
import SearchBar from "../components/SearchBar";
import Welcome from "../components/Welcome";
import TableLoader from "../components/Loaders/TableLoader";
import PaginationTable from "../components/PaginationTable";

export default function UsersBalance() {
    const [users, setUsers] = useState(null);
    const [search, setSearch] = useState("");
    const [offset, setOffset] = useState(1);

    const handleSearchSubmit = async (ev) => {
        ev.preventDefault();
        const search = ev.target["search"].value;

        setSearch(search);
    }

    const handleCountryChange = async (countryId) => {
        console.log(countryId);
    }

    const handlePagination = async (page) => {
        console.log(page);
    }

    return (
        <>
            <section>
                <Welcome text="Saldo de usuarios" showButton={false} />
            </section>
            <section className="py-4">
                <form onSubmit={handleSearchSubmit} action='GET' className='form-group row'>
                    <div className='col-8'><FilterTableButtons data={[]} callback={handleCountryChange} /></div>
                    <div className='col-4'><SearchBar text='Usuario' /></div>
                </form>
            </section>
            <section>
                <div className="mb-4 d-flex justify-content-end">
                    <PaginationTable offset={offset} text='usuarios' quantity={users?.last_page || 1} itemsTotal={users?.total || 0} handleChange={handlePagination} />
                </div>
                {
                    Array.isArray(users?.data) ?
                    <table className="table table-striped TableP">
                        <thead></thead>
                        <tbody>
                            {
                                users.data.length > 0 ?
                                users.data.map((_, index) => {
                                    return <tr key={index}></tr>
                                }) :
                                <tr>
                                    <td>No hay registros</td>
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