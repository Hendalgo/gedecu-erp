import { useFormatDate } from "../../hooks/useFormatDate";
import TableLoader from "../Loaders/TableLoader";
import PaginationTable from "../PaginationTable";

export default function ReportsByUserTable({
    data = null,
    loading = false,
    onPagination = () => null,
}) {
    return (
        <>
            {
                (loading || !data) ?
                <TableLoader /> :
                <>
                    <div className="row mt-4 mb-2">
                        <div className="col-12">
                            <div className="d-flex justify-content-end">
                                <PaginationTable
                                    offset={data.current_page}
                                    text="reportes"
                                    quantity={data.last_page}
                                    itemsTotal={data.total}
                                    handleChange={onPagination}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-100 overflow-hidden mb-4 border rounded">
                        <table className="m-0 table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Fecha - Hora</th>
                                    <th scope="col">Tipo</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.data.length > 0 ?
                                    data.data.map(({id, created_at, type},) => {
                                        return <tr key={id}>
                                            <td>#{id.toString().padStart(6, "0")}</td>
                                            <td>{useFormatDate(created_at)}</td>
                                            <td>{type.name}</td>
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
                </>
            }
        </>
    );
}