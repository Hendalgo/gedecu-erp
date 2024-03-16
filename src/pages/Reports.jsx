import { useContext, useEffect, useRef, useState } from "react";
import { SessionContext } from "../context/SessionContext";
import FilterTableButtons from "../components/FilterTableButtons";
import SearchBar from "../components/SearchBar";
import { Outlet, useNavigate } from "react-router-dom";
import { getReports } from "../helpers/reports";
import Welcome from "../components/Welcome";
import ModalCreateReport from "../components/ModalCreateReport";
import { DASHBOARD_ROUTE, REPORTS_ROUTE, USERS_ROUTE } from "../consts/Routes";
import { getUsersRoles } from "../helpers/users";
import AlertMessage from "../components/AlertMessage";
import ReportsTable from "../components/ReportsTable";

const Reports = () => {
  return <Outlet />;
};

export const ReportsIndex = () => {
  const { session } = useContext(SessionContext);
  const [offset, setOffset] = useState(1);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState(false);
  const [date, setDate] = useState("");
  const [modalCreateShow, setModalCreateShow] = useState(false);
  const [alert, setAlert] = useState({ message: "", variant: "danger" });
  const [reports, setReports] = useState(null);
  const form = useRef();
  const navigate = useNavigate();

  const fetchReports = async (query = ``) => {
    try {
      return await getReports(`order=created_at&order_by=desc${query}`);
    } catch (error) {
      let errorMessages = [];
      if (error.response) {
        const { errors, message } = error.response.data;

        if (errors) errorMessages.push(errors);
        else errorMessages.push(message);
      } else {
        errorMessages.push(error.message);
      }

      setAlert({ message: errorMessages.join("."), variant: "danger" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [rolesResponse, reportsResponse] = await Promise.all([
        getUsersRoles(),
        fetchReports(),
      ]);
      if (rolesResponse) setRoles(rolesResponse);
      if (reportsResponse) setReports(reportsResponse);
    };

    if (session.role_id !== 1)
      return navigate(
        `/${DASHBOARD_ROUTE}/${USERS_ROUTE}/${session.id}/reports`,
      );

    fetchData();
  }, []);

  const handleChange = (offset) => {
    setOffset(offset.selected + 1);
    let params = `order=created_at&order_by=desc&page=${offset.selected + 1}`;
    if (form.current.filter_type.value != "false") params += `&role=${form.current.filter_type.value}`;
    if (form.current.search.value) params += `&search=${form.current.search.value}`;
    getReports(params).then((r) => setReports(r));
  };

  const handleType = (e) => {
    setOffset(1);

    setRole(e);

    let params = e ? `&role=${e}` : "";

    if (date) params += `&date=${date}`;
    if (form.current.search.value)
      params += `&search=${form.current.search.value}`;

    fetchReports(params).then((response) => setReports(response));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setOffset(1);

    let params = form.current.search.value
      ? `&search=${form.current.search.value}`
      : "";

    if (date) params += `&date=${date}`;
    if (role) params += `&role=${role}`;

    fetchReports(params).then((response) => setReports(response));
  };

  return (
    <>
      <div className="container-fluid">
        <Welcome
          text="Reportes"
          add={() => navigate(`/${DASHBOARD_ROUTE}/${REPORTS_ROUTE}/create`)}
          textButton="Reporte"
          showButton={session.role_id > 1}
        />
        <div className="mt-4">
          <form
            onSubmit={handleSearch}
            action=""
            ref={form}
            className="form-group"
          >
            <div className="row mb-3">
              <div className="col-8">
                <FilterTableButtons data={roles} callback={handleType} />
              </div>
              <div className="col-4">
                <SearchBar text="Reportes" />
              </div>
            </div>
            <div className="row">
              <div className="d-flex col-4">
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
              </div>
            </div>
          </form>
        </div>
        <ReportsTable loading={!reports} data={reports} onPaginate={handleChange} />
        <div className="">
          {modalCreateShow && (
            <ModalCreateReport
              setModalShow={setModalCreateShow}
              modalShow={modalCreateShow}
            />
          )}
        </div>
      </div>
      <AlertMessage
        show={alert.message.length > 0}
        setShow={() => setAlert((prev) => ({ ...prev, message: "" }))}
        message={alert.message}
        variant={alert.variant}
      />
    </>
  );
};

export default Reports;
