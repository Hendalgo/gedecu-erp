import { useFormatDate } from "../../hooks/useFormatDate";
import TableLoader from "../Loaders/TableLoader";
import PaginationTable from "../PaginationTable";

export default function ReportsTable({
    data = null,
    loading = false,
    onPaginate = () => null,
}) {
    return (
        <>
            {
                (loading || !data) ?
                <TableLoader /> :
                <>
                    <div className="row mt-4 mb-2">
                        <div className="col">
                            <div className="d-flex justify-content-end">
                                <PaginationTable
                                    text="reportes"
                                    offset={data.current_page}
                                    quantity={data.last_page}
                                    itemsTotal={data.total}
                                    handleChange={onPaginate}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="d-flex">
                            <div className="w-100 overflow-hidden mb-4 border rounded">
                                <table className="m-0 table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">Responsable</th>
                                            <th scope="col">Rol</th>
                                            <th scope="col">Fecha - Hora</th>
                                            <th scope="col" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.data.length > 0 ?
                                            data.data.map(({id, user, created_at},) => {
                                                return <tr key={id}>
                                                    <td>{user.name} ({user.email})</td>
                                                    <td>{user.role.name}</td>
                                                    <td>{useFormatDate(created_at)}</td>
                                                    <td>
                                                        <button className="btn">
                                                            
                                                        </button>
                                                    </td>
                                                </tr>
                                            }) :
                                            <tr>
                                                <td colSpan={4} className="text-center">
                                                    No hay registros
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    );
}