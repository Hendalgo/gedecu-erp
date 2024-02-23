import { useEffect, useState, useRef, useContext } from "react";
import { getInconsistences, } from "../helpers/reports";
import Welcome from "../components/Welcome";
import FilterTableButtons from "../components/FilterTableButtons";
import PaginationTable from "../components/PaginationTable";
import { SessionContext } from "../context/SessionContext";
import { useNavigate } from "react-router-dom";
import TableLoader from "../components/Loaders/TableLoader";
import SearchBar from "../components/SearchBar";
import { DASHBOARD_ROUTE, HOME_ROUTE } from "../consts/Routes";
import AlertMessage from "../components/AlertMessage";
import { getBankAccounts } from "../helpers/banksAccounts";
import { getUsersBalance } from "../helpers/users";
import UsersBalanceTable from "../components/UsersBalanceTable";
import BankAccountsTable from "../components/BankAccountsTable";
import { handleError } from "../utils/error";
import { useFormatDate } from "../hooks/useFormatDate";

const statusOptions = [
  {id: "yes", name: "Verificado"},
  {id: "no", name: "No verificado"},
];

const Inconsistences = () => {
  const [inconsistences, setInconsistences] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [balances, setBalances] = useState(null);
  const [alert, setAlert] = useState({ message: "", variant: "danger" });
  const statusRef = useRef(false);
  const searchRef = useRef("");
  const dateRef = useRef("");

  const { session } = useContext(SessionContext);
  const navigate = useNavigate();

  const fetchInconsistences = async (params = '') => {
    if (searchRef.current) params += `&search=${searchRef.current}`;

    if (dateRef.current) params += `&date=${dateRef.current}`;

    if (statusRef.current) params += `&status=${statusRef.current}`;

    try {
      return await getInconsistences(`order=created_at&order_by=desc${params}`);
    } catch (err) {
      let errorMessage = handleError(err);

      setAlert((prev) => ({...prev, message: errorMessage.join(" | "), variant: "danger"}));
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const [inconsistencesResponse, accountsResponse, balancesResponse] = await Promise.all([fetchInconsistences(), getBankAccounts("negatives=yes"), getUsersBalance("moreThanOne=yes")]);
      setInconsistences(inconsistencesResponse);
      setAccounts(accountsResponse);
      setBalances(balancesResponse);
    }

    if (session.role_id !== 1) {
      navigate(`${DASHBOARD_ROUTE}/${HOME_ROUTE}`);
    }

    fetchData();

  }, []);

  const handleStatusChange = async (option) => {
    statusRef.current = option;
    const response = await fetchInconsistences();
    console.log(response);
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const response = await fetchInconsistences();
    console.log(response);
  }

  const handlePagination = async ({ selected }) => {
    const newOffset = selected + 1;
    const response = await fetchInconsistences(`&page=${newOffset}`);
    console.log(response);
  }

  const handleBalancesPagination = async ({ selected }) => {
    try {
      const response = await getUsersBalance(`moreThanOne=yes&page=${selected + 1}`);
      setBalances(response);
    } catch (err) {
      let errorMessages = handleError(err);
      setAlert({ message: errorMessages.join(" | "), variant: "danger" });
    }
  }

  const handleAccountsPagination = async ({ selected }) => {
    console.log(selected)
  }

  return (
    <div className="container-fluid">
      <section>
        <Welcome text="Inconsistencias" showButton={false} />
      </section>
      <section className="py-4">
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row mb-3">
            <div className="col-8">
              <FilterTableButtons data={statusOptions} callback={handleStatusChange} />
            </div>
            <div className="col-4">
              <SearchBar text="Inconsistencias" change={(value) => searchRef.current = value} />
            </div>
          </div>
          <div className="row">
            <div className="col-4 d-flex">
              <input type="date" name="date" id="" onChange={({target}) => dateRef.current = target.value} className="form-control form-control-sm rounded-0 rounded-start" />
              <button type="submit" className="btn btn-secondary rounded-0 rounded-end">Filtrar</button>
            </div>
          </div>
        </form>
        <div>
          {
            inconsistences ?
            <>
              <div className="mb-2 d-flex justify-content-end">
                <PaginationTable handleChange={handlePagination} text="inconsistencias" itemsTotal={inconsistences.total} offset={inconsistences.current_page} quantity={inconsistences.last_page} />
              </div>
              <div className="w-100">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Usuario</th>
                      <th>Tipo</th>
                      <th>Fecha - Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      inconsistences.data.length == 0 ?
                      <tr>
                        <td colSpan={4}>No hay registros.</td>
                      </tr> :
                      inconsistences.data.map(({ id, report, created_at }) => {
                        return <tr key={id}>
                          <td>#{id.toString().padStart(6, '0')}</td>
                          <td>{report.user.name} ({report.user.email})</td>
                          <td>{report.type.name}</td>
                          <td>{useFormatDate(created_at)}</td>
                        </tr>
                      })
                    }
                  </tbody>
                </table>
              </div>
            </> :
            <TableLoader />
          }
        </div>
      </section>
      <section className="py-4">
        <p>Cuentas de banco con saldo negativo</p>
        <BankAccountsTable data={accounts} onPagination={handleAccountsPagination} />
      </section>
      <section className="py-4">
        <p>Usuarios con saldos diferentes de 0</p>
        <UsersBalanceTable data={balances} onPaginate={handleBalancesPagination} />
      </section>
      <AlertMessage
        show={alert.message.length > 0}
        message={alert.message}
        setShow={() => setAlert((prev) => ({...prev, message: ""}))}
        variant={alert.variant}
      />
    </div>
  );
};

export default Inconsistences;
