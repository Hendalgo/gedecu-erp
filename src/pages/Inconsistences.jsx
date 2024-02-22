import { useEffect, useState, useRef, useContext } from "react";
import { getInconsistences, updateReport } from "../helpers/reports";
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
      return await getInconsistences(`order_by=created_at&order=desc${params}`);
    } catch (err) {
      let errorMessage = handleError(err);

      setAlert((prev) => ({...prev, message: errorMessage.join(" | "), variant: "danger"}));
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const [inconsistencesResponse, accountsResponse, balancesResponse] = await Promise.all([fetchInconsistences(), getBankAccounts("negative=yes"), getUsersBalance("moreThanOne=yes")]);
      // setInconsistences(inconsistencesResponse);
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
    console.log(selected)
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
              <div>
                <PaginationTable handleChange={handlePagination} text="inconsistencias" itemsTotal={0} offset={1} quantity={0} />
              </div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      inconsistences.data.length == 0 ?
                      <tr>
                        <td>No hay registros.</td>
                      </tr> :
                      inconsistences.data.map((inconsistence) => {
                        return <tr key={inconsistence.id}><td>Inconsistencia</td></tr>
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
