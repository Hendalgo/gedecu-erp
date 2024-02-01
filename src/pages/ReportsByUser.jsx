import { useContext, useEffect, useState } from "react";
import { getReports } from "../helpers/reports";
import { SessionContext } from "../context/SessionContext";
import TableLoader from "../components/Loaders/TableLoader";
import Welcome from "../components/Welcome";
import PaginationTable from "../components/PaginationTable";
import { useNavigate, useParams } from "react-router-dom";
import { DASHBOARD_ROUTE, REPORTS_ROUTE } from "../consts/Routes";
import { useFormatDate } from "../hooks/useFormatDate";

export default function ReportsByUser() {
  const [reports, setReports] = useState(null);
  const [date, setDate] = useState("");
  const [offset, setOffset] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useContext(SessionContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const getUserReports = async (params = "") => {
    try {
      setIsLoading(true);
      const reportsData = await getReports(
        `order=created_at&order_by=desc&user=${id}${params}`,
      );
      setIsLoading(false);
      return reportsData;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setReports(await getUserReports());
    };

    fetchData();
  }, []);

  const handleDate = async (ev) => {
    ev.preventDefault();
    setOffset(1);

    setReports(await getUserReports(`&date=${date}`));
  };

  const handlePagination = async ({ selected }) => {
    setOffset(selected + 1);

    setReports(await getUserReports(`&page=${selected + 1}`));
  };

  if (!reports) return <></>;

  return (
    <>
      <section>
        <Welcome
          text="Reportes de usuario"
          showButton={session.role_id !== 1}
          add={() => navigate(`/${DASHBOARD_ROUTE}/${REPORTS_ROUTE}/create`)}
          textButton="Reportes"
        />
      </section>
      <section>
        <div className="row mt-3">
          <div className="col-4">
            <form
              onSubmit={(e) => handleDate(e)}
              className="d-flex"
              method="post"
            >
              <input
                style={{ borderRadius: "0.25rem 0 0 0.25rem" }}
                type="date"
                name="date"
                value={date}
                onChange={({ target }) => setDate(target.value)}
                className="form-control form-control-sm"
                id=""
              />
              <input
                style={{ borderRadius: "0 0.25rem 0.25rem 0" }}
                type="submit"
                className="btn btn-secondary"
                value="Filtrar"
              />
            </form>
          </div>
        </div>
      </section>
      <section>
        {(!reports || isLoading) && (
          <div className="mt-4">
            <TableLoader />
          </div>
        )}

        {!isLoading && reports && Array.isArray(reports.data) && (
          <>
            <div className="row mt-4">
              <div className="col-12">
                <div className="d-flex justify-content-end">
                  <PaginationTable
                    offset={offset}
                    text="Reportes"
                    quantity={reports.last_page}
                    itemsTotal={reports.total}
                    handleChange={handlePagination}
                  />
                </div>
              </div>
            </div>
            <table className="mt-2 table table-striped tableP">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Fecha - Hora</th>
                  <th scope="col">Tipo</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {reports.data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No hay reportes para mostrar.
                    </td>
                  </tr>
                ) : (
                  reports.data.map(({ id, created_at, type }) => {
                    return (
                      <tr key={id}>
                        <td>#{id.toString().padStart(6, "0")}</td>
                        <td>{useFormatDate(created_at)}</td>
                        <td>{type.name}</td>
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
                    );
                  })
                )}
              </tbody>
            </table>
          </>
        )}
      </section>
    </>
  );
}
