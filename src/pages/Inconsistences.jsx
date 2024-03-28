import { useEffect, useState, useRef, useContext, Fragment } from "react";
import {
  getInconsistences,
  patchInconsistence,
  patchInconsistencesMassive,
} from "../helpers/reports";
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
import { Modal } from "react-bootstrap";
import ReportCard from "../components/ReportCard";

const statusOptions = [
  { id: "yes", name: "Verificado" },
  { id: "no", name: "No verificado" },
];

const Inconsistences = () => {
  const [inconsistences, setInconsistences] = useState(null);
  const [inconsistenceDetail, setInconsistenceDetail] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [balances, setBalances] = useState(null);
  const [alert, setAlert] = useState({ message: "", variant: "danger" });
  const statusRef = useRef(false);
  const searchRef = useRef("");
  const dateRef = useRef("");

  const { session } = useContext(SessionContext);
  const navigate = useNavigate();

  const fetchInconsistences = async (params = "") => {
    if (searchRef.current) params += `&search=${searchRef.current}`;

    if (dateRef.current) params += `&date=${dateRef.current}`;

    if (statusRef.current) params += `&verified=${statusRef.current}`;

    try {
      return await getInconsistences(`order=created_at&order_by=desc${params}`);
    } catch (err) {
      let errorMessage = handleError(err);

      setAlert((prev) => ({
        ...prev,
        message: errorMessage.join(" | "),
        variant: "danger",
      }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [inconsistencesResponse, accountsResponse, balancesResponse] =
        await Promise.all([
          fetchInconsistences(),
          getBankAccounts("negatives=yes"),
          getUsersBalance("moreThanOne=yes"),
        ]);
      setInconsistences(inconsistencesResponse);
      setAccounts(accountsResponse);
      setBalances(balancesResponse);
    };

    if (session.role_id !== 1) {
      navigate(`${DASHBOARD_ROUTE}/${HOME_ROUTE}`);
    }

    fetchData();
  }, []);

  const handleStatusChange = async (option) => {
    statusRef.current = option;
    const response = await fetchInconsistences();
    setInconsistences(response);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const response = await fetchInconsistences();
    setInconsistences(response);
  };

  const handlePagination = async ({ selected }) => {
    const newOffset = selected + 1;
    const response = await fetchInconsistences(`&page=${newOffset}`);
    setInconsistences(response);
  };

  const handleBalancesPagination = async ({ selected }) => {
    try {
      const response = await getUsersBalance(
        `moreThanOne=yes&page=${selected + 1}`,
      );
      setBalances(response);
    } catch (err) {
      let errorMessages = handleError(err);
      setAlert({ message: errorMessages.join(" | "), variant: "danger" });
    }
  };

  const handleAccountsPagination = async ({ selected }) => {
    const response = await getBankAccounts(
      `negatives=yes&page=${selected + 1}`,
    );
    setAccounts(response);
  };

  const verifyInconsistence = async (id) => {
    try {
      let response = await patchInconsistence(id);

      if (response.status == 200) {
        response = await fetchInconsistences();
        setInconsistences(response);

        setAlert({
          message: "Inconsistencia verificada",
          variant: "success",
        });
      }
    } catch (err) {
      let errorMessages = handleError(err);
      setAlert((prev) => ({ ...prev, message: errorMessages.join(" | ") }));
    }
  };

  const verifyInconsistencesMassive = async () => {
    try {
      let response = await patchInconsistencesMassive();
      if (response.status == 200) {
        response = await fetchInconsistences();
        setInconsistences(response);

        setAlert({
          message: "Inconsistencias verificadas",
          variant: "success",
        });
      }
    } catch (err) {
      let errorMessages = handleError(err);
      setAlert((prev) => ({ ...prev, message: errorMessages.join(" | ") }));
    }
  };

  const showInconsistence = (inconsistenceId) => {
    const inconsistence = inconsistences.data.find(
      ({ id }) => id == inconsistenceId,
    );
    if (inconsistence) {
      setInconsistenceDetail(inconsistence);
    }
  };

  let suggestedPairs = [];

  if (inconsistenceDetail && inconsistenceDetail.inconsistences.length == 0) {
    const { data } = inconsistenceDetail;
    Object.entries(data).forEach(([key, val]) => {
      if (["supplier", "user", "store"].includes(key)) {
        suggestedPairs.push(val);
      }
    });
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
              <FilterTableButtons
                data={statusOptions}
                callback={handleStatusChange}
              />
            </div>
            <div className="col-4">
              <SearchBar
                text="Inconsistencias"
                change={(value) => (searchRef.current = value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4 d-flex">
              <input
                type="date"
                name="date"
                id=""
                onChange={({ target }) => (dateRef.current = target.value)}
                className="form-control form-control-sm rounded-0 rounded-start"
              />
              <button
                type="submit"
                className="btn btn-secondary rounded-0 rounded-end"
              >
                Filtrar
              </button>
            </div>
          </div>
        </form>
        <div>
          {inconsistences ? (
            <>
              <div className="mb-2 d-flex justify-content-end">
                <PaginationTable
                  handleChange={handlePagination}
                  text="inconsistencias"
                  itemsTotal={inconsistences.total}
                  offset={inconsistences.current_page}
                  quantity={inconsistences.last_page}
                />
              </div>
              <div className="mb-2 d-flex justify-content-end">
                <button
                  className="btn btn-primary"
                  disabled={!inconsistences || inconsistences.data.length == 0}
                  onClick={() => verifyInconsistencesMassive()}
                >
                  Verificar todas
                </button>
              </div>
              <div className="w-100 overflow-hidden overflow-x-auto mb-4 border rounded">
                <table className="m-0 table table-striped">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Usuario</th>
                      <th>Reporte</th>
                      <th>Fecha</th>
                      <th>Usuario</th>
                      <th>Reporte</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {inconsistences.data.length == 0 ? (
                      <tr>
                        <td colSpan={8}>No hay registros.</td>
                      </tr>
                    ) : (
                      inconsistences.data.map(
                        ({ id, inconsistences, report, created_at }) => {
                          let styles = JSON.parse(report.type.config)?.styles;
                          const { user, type } = report;

                          const userStore = user.store;

                          const inconsistenceSummary = inconsistences.at(0);
                          let pairStyles;
                          if (
                            inconsistenceSummary &&
                            inconsistenceSummary.report.type.config
                          ) {
                            pairStyles = JSON.parse(
                              inconsistenceSummary.report.type.config,
                            )?.styles;
                          }
                          const isVerfied = inconsistences.some(({ pivot }) => {
                            return pivot.verified == 1;
                          });

                          return (
                            <tr key={id}>
                              <td>{useFormatDate(created_at, false, true)}</td>
                              <td>
                                {userStore
                                  ? userStore.name
                                  : `${user.name} (${user.email})`}
                              </td>
                              <td>
                                <span
                                  className="p-1 rounded"
                                  style={{ ...styles }}
                                >
                                  {type.name}
                                </span>
                              </td>
                              {inconsistences.length == 0 ? (
                                <td colSpan={3}>No existen parejas.</td>
                              ) : (
                                <>
                                  <td>
                                    {useFormatDate(
                                      inconsistenceSummary.created_at,
                                      false,
                                      true,
                                    )}
                                  </td>
                                  <td>{`${inconsistenceSummary.report.user.name} (${inconsistenceSummary.report.user.email})`}</td>
                                  <td>
                                    <span
                                      className="p-1 rounded"
                                      style={{ ...pairStyles }}
                                    >
                                      {inconsistenceSummary.report.type.name}
                                    </span>
                                  </td>
                                </>
                              )}
                              <td>
                                <button
                                  className="border-0"
                                  onClick={() => showInconsistence(id)}
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
                              <td>
                                {!isVerfied && (
                                  <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => verifyInconsistence(id)}
                                  >
                                    Verificar
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        },
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <TableLoader />
          )}
        </div>
        {inconsistenceDetail && (
          <Modal
            size="xl"
            centered
            show={inconsistenceDetail != null}
            onHide={() => setInconsistenceDetail(null)}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <p className="m-0 ModalTopTitle">Inconsistencia</p>
                <p className="m-0 ModalTopSubTitle"></p>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex">
                <div className="w-50 border-end">
                  <ReportCard report={inconsistenceDetail} />
                </div>
                <div className="w-50 mh-100 overflow-y-auto">
                  {inconsistenceDetail.inconsistences.length > 0 ? (
                    inconsistenceDetail.inconsistences.map((inconsistence) => {
                      return (
                        <Fragment key={inconsistence.id}>
                          <ReportCard report={inconsistence} />
                          <hr />
                        </Fragment>
                      );
                    })
                  ) : (
                    <div className="h-100 w-100 px-4 py-2 bg-light">
                      <p
                        style={{
                          color: "#6C7DA3",
                          fontWeight: 600,
                        }}
                      >
                        Reporte en espera de:
                      </p>
                      <p
                        style={{
                          color: "#495057",
                          fontSize: "16px",
                          fontWeight: 600,
                        }}
                      >
                        {suggestedPairs.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>
        )}
      </section>
      <section className="py-4">
        <p>Cuentas de banco con saldo negativo</p>
        <BankAccountsTable
          data={accounts}
          onPagination={handleAccountsPagination}
        />
      </section>
      <section className="py-4">
        <p>Usuarios con saldos diferentes de 0</p>
        <UsersBalanceTable
          data={balances}
          onPaginate={handleBalancesPagination}
        />
      </section>
      <AlertMessage
        show={alert.message.length > 0}
        message={alert.message}
        setShow={() => setAlert((prev) => ({ ...prev, message: "" }))}
        variant={alert.variant}
      />
    </div>
  );
};

export default Inconsistences;
