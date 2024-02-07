import { useContext, useEffect, useState } from "react";
import { getReports } from "../helpers/reports";
import { SessionContext } from "../context/SessionContext";
import TableLoader from "../components/Loaders/TableLoader";
import Welcome from "../components/Welcome";
import PaginationTable from "../components/PaginationTable";
import { useNavigate, useParams } from "react-router-dom";
import { DASHBOARD_ROUTE, REPORTS_ROUTE } from "../consts/Routes";
import { useFormatDate } from "../hooks/useFormatDate";
import ReportsByUserTable from "../components/ReportsByUserTable";

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
      <div className="container-fluid">
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
                  type="date"
                  name="date"
                  value={date}
                  onChange={({ target }) => setDate(target.value)}
                  className="form-control form-control-sm rounded-0 rounded-start"
                  id=""
                />
                <input
                  type="submit"
                  className="btn btn-secondary rounded-0 rounded-end"
                  value="Filtrar"
                />
              </form>
            </div>
          </div>
        </section>
        <section>
          {!isLoading && reports && Array.isArray(reports.data) && (
            <ReportsByUserTable loading={isLoading} data={reports} />
          )}
        </section>
      </div>
    </>
  );
}
