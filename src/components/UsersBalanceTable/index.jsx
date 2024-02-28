import { formatAmount } from "../../utils/amount";
import TableLoader from "../Loaders/TableLoader"
import PaginationTable from "../PaginationTable";

export default function UsersBalanceTable({
  data = null,
  onPaginate = () => null,
}) {
  return (
    <>
      {
        data ?
          <>
            <div className="mb-2 d-flex justify-content-end">
              <PaginationTable handleChange={onPaginate} itemsTotal={data.total} itemsPerPage={data.per_page} offset={data.current_page} text="usuarios" quantity={data.last_page} />

            </div>
            <div className="w-100 overflow-hidden border rounded mb-4">
              <table className="m-0 table table-striped">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.data.length ?
                      data.data.map(({ id, user, balance, currency },) => {
                        return <tr key={id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{formatAmount(balance, currency.shortcode)}</td>
                        </tr>
                      }) :
                      <tr>
                        <td colSpan={3}>
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