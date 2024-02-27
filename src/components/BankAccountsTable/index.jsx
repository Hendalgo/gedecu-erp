import { formatAmount } from "../../utils/amount";
import TableLoader from "../Loaders/TableLoader";
import PaginationTable from "../PaginationTable";

export default function BankAccountsTable({
    data = null,
    onPagination = () => null,
}) {
    return (
        <>
            {
                data ?
                <>
                    <div className="mb-2 d-flex justify-content-end">
                        <PaginationTable itemsTotal={data.total} itemsPerPage={data.per_page} offset={data.current_page} quantity={data.last_page} text="cuentas" handleChange={onPagination} />
                    </div>
                    <div className="w-100 overflow-hidden border rounded mb-4">
                        <table className="m-0 table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Encargado</th>
                                    <th>Propietario</th>
                                    <th>Balance</th>
                                    <th>Banco</th>
                                    <th>País</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.data.length ?
                                    data.data.map(({ id, identifier, user, store, name, balance, bank,  }) => {
                                        return <tr key={id}>
                                            <td>{identifier}</td>
                                            <td>{ user ? user.name : (store.user ? store.user.name : "Sin encargado") }</td>
                                            <td>{name}</td>
                                            <td>{formatAmount(balance)}</td>
                                            <td>{bank.name}</td>
                                            <td>{bank.country.name}</td>
                                        </tr>
                                    })
                                    :
                                    <tr>
                                        <td colSpan={6}>
                                            No hay registros.
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </>
                :
                <TableLoader />
            }
        </>
    );
}