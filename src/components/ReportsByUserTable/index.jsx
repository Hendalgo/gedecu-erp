import { useNavigate } from "react-router-dom";
import { useFormatDate } from "../../hooks/useFormatDate";
import TableLoader from "../Loaders/TableLoader";
import PaginationTable from "../PaginationTable";
import { DASHBOARD_ROUTE, REPORTS_ROUTE, } from "../../consts/Routes";

export default function ReportsByUserTable({
  data = null,
  loading = false,
  showPagination = true,
  onPagination = () => null,
}) {
  const navigate = useNavigate();

  return (
    <div className="mt-4 mb-2">
      {
        (loading || !data) ?
          <TableLoader /> :
          <>
            {
              showPagination &&
                        <div className="row mb-2">
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
            }
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
                          <td>{type.name} - {type.type === "income" ? "Ingreso" : "Egreso"}</td>
                          <td>
                            <button
                              className="btn"
                              onClick={() =>
                                navigate(
                                  `/${DASHBOARD_ROUTE}/${REPORTS_ROUTE}/${id}`,
                                )
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="17"
                                height="13"
                                viewBox="0 0 17 13"
                                fill="none"
                              >
                                <path
                                  d="M15.7875 4.42276C14.1685 1.92492 11.4045 0.405734 8.42802 0.377808C5.45154 0.405734 2.68754 1.92492 1.06859 4.42276C0.215419 5.67484 0.215419 7.32149 1.06859 8.5736C2.68663 11.073 5.45079 12.5937 8.42805 12.6226C11.4045 12.5946 14.1685 11.0755 15.7875 8.57762C16.6425 7.3246 16.6425 5.67575 15.7875 4.42276ZM14.1309 7.43838C12.8949 9.39888 10.7456 10.595 8.42802 10.6122C6.11048 10.595 3.9612 9.39888 2.72514 7.43838C2.3398 6.87226 2.3398 6.12809 2.72514 5.562C3.96116 3.60151 6.11045 2.4054 8.42802 2.38822C10.7456 2.40537 12.8948 3.60151 14.1309 5.562C14.5162 6.12809 14.5162 6.87226 14.1309 7.43838Z"
                                  fill="#0D6EFD"
                                />
                                <path
                                  d="M8.4281 9.18066C9.90852 9.18066 11.1086 7.98054 11.1086 6.50012C11.1086 5.0197 9.90852 3.81958 8.4281 3.81958C6.94768 3.81958 5.74756 5.0197 5.74756 6.50012C5.74756 7.98054 6.94768 9.18066 8.4281 9.18066Z"
                                  fill="#0D6EFD"
                                />
                              </svg>
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
    </div>
  );
}