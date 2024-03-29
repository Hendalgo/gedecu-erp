import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../context/SessionContext";
import FilterTableButtons from "../components/FilterTableButtons";
import SearchBar from "../components/SearchBar";
import PaginationTable from "../components/PaginationTable";
import { useNavigate } from "react-router-dom";
import { getDuplicates } from "../helpers/reports";
import Welcome from "../components/Welcome";
import TableLoader from "../components/Loaders/TableLoader";
import AlertMessage from "../components/AlertMessage";
import {
  DASHBOARD_ROUTE,
  HOME_ROUTE,
  REPORTS_DUPLICATE_ROUTE,
  REPORTS_ROUTE,
} from "../consts/Routes";
import { formatAmount } from "../utils/amount";

const DuplicateReports = () => {
  const { session } = useContext(SessionContext);
  const [offset, setOffset] = useState(1);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState({ message: "", variant: "danger" });

  const reportsTypes = [
    { id: "yes", name: "Verificados" },
    { id: "no", name: "Sin verificar" },
  ];
  const [reportType, setReportType] = useState(false);
  const [date, setDate] = useState("");

  const [duplicates, setDuplicates] = useState(null);
  const navigate = useNavigate();

  const fetchDuplicates = async (query = "") => {
    try {
      return await getDuplicates(`order=created_at&order_by=desc${query}`);
    } catch ({ response }) {
      let errorMessage = "";
      const { error } = response.data;
      if (error) errorMessage = error;
      setAlert({ message: errorMessage, variant: "danger" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setDuplicates(await fetchDuplicates());
    };

    if (session.role_id != 1) {
      navigate(`/${DASHBOARD_ROUTE}/${HOME_ROUTE}`);
    }

    fetchData();
  }, []);

  const handleChange = async (offset) => {
    const newOffset = offset.selected + 1;
    setOffset(newOffset);

    let params = `&page=${newOffset}`;

    if (date) params += `&date=${date}`;
    if (search) params += `&search=${search}`;
    if (reportType) params += `&completed=${reportType}`;

    setDuplicates(await fetchDuplicates(params));
  };

  const handleType = async (e) => {
    setOffset(1);
    setReportType(e);

    let params = `${e ? `&completed=${e}` : ""}`;

    if (date) params += `&date=${date}`;
    if (search) params += `&search=${search}`;

    setDuplicates(await fetchDuplicates(params));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setOffset(1);

    let params = `${search ? `&search=${search}` : ""}`;

    if (date) params += `&date=${date}`;
    if (reportType) params += `&completed=${reportType}`;

    setDuplicates(await fetchDuplicates(params));
  };

  return (
    <>
      <div className="container-fluid">
        <Welcome text="Reportes duplicados" showButton={false} />
        <div className="mt-4">
          <form onSubmit={handleSearch} action="" className="form-group">
            <div className="row mb-3">
              <div className="col-8">
                <FilterTableButtons data={reportsTypes} callback={handleType} />
              </div>
              <div className="col-4">
                <SearchBar text="Duplicados" change={setSearch} />
              </div>
            </div>
            <div className="row">
              <div className="d-flex col-4">
                <input
                  type="date"
                  name="date"
                  onChange={({ target }) => setDate(target.value)}
                  className="form-control form-control-sm rounded-0 rounded-start"
                  id=""
                />
                <input
                  type="submit"
                  className="btn btn-secondary rounded-0 rounded-end"
                  value="Filtrar"
                />
              </div>
            </div>
          </form>
        </div>
        {Array.isArray(duplicates?.data) ? (
          duplicates.data.length > 0 ? (
            <>
              <div className="row mt-4">
                <div className="col-12 d-flex justify-content-end">
                  <PaginationTable
                    offset={offset}
                    itemOffset={offset}
                    quantity={duplicates.last_page}
                    itemsTotal={duplicates.total}
                    handleChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="table-responsive">
                  <div className="w-100 overflow-hidden border rounded mb-4">
                    <table className="m-0 table table-striped">
                      <thead className="">
                        <tr className="pt-4">
                          <th scope="col">Realizado por</th>
                          <th scope="col">Rol</th>
                          <th scope="col">Fecha - Hora</th>
                          <th scope="col">Motivo</th>
                          <th scope="col">Monto</th>
                          {session.role_id === 1 && <th />}
                        </tr>
                      </thead>
                      <tbody>
                        {duplicates.data.map(
                          ({
                            id,
                            report,
                            created_at,
                            currency,
                            amount,
                            duplicate_status,
                          }) => {
                            const reportTypeStyle = JSON.parse(
                              report.type.config,
                            );
                            return (
                              <tr key={id}>
                                <td>
                                  {report.user.name} ({report.user.email})
                                </td>
                                <td>{report.user.role.name}</td>
                                <td>
                                  {new Date(created_at).toLocaleString("es-VE", {
                                    hour12: true,
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    second: "numeric",
                                  })}
                                </td>
                                <td>
                                  <span
                                    style={{ ...reportTypeStyle.styles }}
                                    className="p-1 rounded"
                                  >
                                    {report.type.name}
                                    {report.type.type == "income"
                                      ? " - Ingreso"
                                      : " - Egreso"}
                                  </span>
                                </td>
                                <td>
                                  {formatAmount(amount, currency.shortcode)}
                                </td>
                                {session.role_id === 1 && (
                                  <td>
                                    <button
                                      className="w-100 btn btn-light border"
                                      onClick={() =>
                                        navigate(
                                          `/${DASHBOARD_ROUTE}/${REPORTS_ROUTE}/${REPORTS_DUPLICATE_ROUTE}/${id}`,
                                        )
                                      }
                                    >
                                      {duplicate_status ? "Ver" : "Verificar"}
                                    </button>
                                  </td>
                                )}
                              </tr>
                            );
                          },
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="d-flex justify-content-center align-items-center">
              No hay reportes duplicados para mostrar
            </div>
          )
        ) : (
          <div className="mt-4">
            <TableLoader />
          </div>
        )}
      </div>
      <AlertMessage
        show={alert.message}
        setShow={() => setAlert({ message: "", variant: "danger" })}
        message={alert.message}
        variant={alert.variant}
      />
    </>
  );
};

export default DuplicateReports;
