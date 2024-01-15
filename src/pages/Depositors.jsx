import { useState } from "react";
import FilterTableButtons from "../components/FilterTableButtons";
import SearchBar from "../components/SearchBar";
import Welcome from "../components/Welcome";
import TableLoader from "../components/Loaders/TableLoader";
import PaginationTable from "../components/PaginationTable";

export default function Depositors() {
    const [depositors, setDepositors] = useState(null);
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
                <Welcome text="Depositantes" showButton={false} />
            </section>
            <section className="py-4">
                <form onSubmit={handleSearchSubmit} action='GET' className='form-group row'>
                    <div className='col-8'><FilterTableButtons data={[]} callback={handleCountryChange} /></div>
                    <div className='col-4'><SearchBar text='Depositante' /></div>
                </form>
            </section>
            <section>
                <div className="mb-4 d-flex justify-content-end">
                    <PaginationTable offset={offset} text='depositantes' quantity={depositors?.last_page || 1} itemsTotal={depositors?.total || 0} handleChange={handlePagination} />
                </div>
                {
                    Array.isArray(depositors?.data) ?
                    <table className="table table-striped TableP">
                        <thead></thead>
                        <tbody>
                            {
                                depositors.data.length > 0 ?
                                depositors.data.map((_, index) => {
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