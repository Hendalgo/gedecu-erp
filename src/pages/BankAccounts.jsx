import { useContext, useEffect, useRef, useState } from "react";
import Welcome from "../components/Welcome";
import SearchBar from "../components/SearchBar";
import { SessionContext } from "../context/SessionContext";
import TableLoader from "../components/Loaders/TableLoader";
import { deleteBankAccount, getBankAccounts } from "../helpers/banksAccounts";
import PaginationTable from "../components/PaginationTable";
import ModalCreateBankAccount from "../components/ModalCreateBankAccount";
import ModalConfirmation from "../components/ModalConfirmation";
import AlertMessage from "../components/AlertMessage";
import { getBanks } from "../helpers/banks";
import FilterTableButtons from "../components/FilterTableButtons";
import { useNavigate } from "react-router-dom";
import { DASHBOARD_ROUTE, HOME_ROUTE } from "../consts/Routes";
import { formatAmount } from "../utils/amount";

const BankAccounts = () => {
  const { session } = useContext(SessionContext);
  const [modalShow, setModalShow] = useState(false);
  const [banks, setBanks] = useState([]);
  const [banksFilter, setBanksFilter] = useState([]);
  const [offset, setOffset] = useState(1);
  const [bankAccount, setBankAccount] = useState();
  const [alert, setAlert] = useState({
    show: false,
    variant: "danger",
    text: "Error al realizar la acción",
  });
  const [modalConfirmShow, setModalConfirmShow] = useState(false);
  const form = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [banksResponse, accountsResponse] = await Promise.all([
          getBanks("paginated=no"),
          getBankAccounts(),
        ]);

        if (banksResponse) setBanksFilter(banksResponse);
        if (accountsResponse) setBanks(accountsResponse);
      } catch ({ message, error }) {
        setAlert({ show: true, text: message, variant: "danger" });
      }
    };

    if ([5, 6].includes(session.role_id)) {
      navigate(`/${DASHBOARD_ROUTE}/${HOME_ROUTE}`);
    }

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setOffset(1);
    if (form.current.search !== "") {
      getBankAccounts(
        `order=created_at&order_by=desc${form.current.filter_type.value !== "false" ? `&bank=${form.current.filter_type.value}` : ""}${form.current.search.value ? `&search=${form.current.search.value}` : ""}`,
      ).then((r) => setBanks(r));
    }
  };

  const handleBankChange = async (bankId) => {
    setOffset(1);
    const accountsResponse = await getBankAccounts(
      `order=created_at${bankId ? `&bank=${bankId}` : ""}${form.current.search.value ? `&search=${form.current.search.value}` : ""}`,
    );
    setBanks(accountsResponse);
  };

  const handleChange = (offset) => {
    setOffset(offset.selected + 1);
    let params = `order=created_at&order_by=desc&page=${offset.selected + 1}`;

    if (form.current.search.value)
      params += `&search=${form.current.search.value}`;

    getBankAccounts(params).then((r) => setBanks(r));
  };

  const handleDelete = (e) => {
    deleteBankAccount(e.id)
      .then((e) => {
        if (e.status === 201) {
          getBankAccounts(
            `order=created_at&order_by=desc&page=${offset}${form.current.search.value ? `&search=${form.current.search.value}` : ""}`,
          ).then((r) => setBanks(r));
          setAlert({
            text: "Cuenta eliminada con éxito.",
            variant: "success",
            show: true,
          });
          return;
        }
        setAlert({
          text: "Error al intentar eliminar la cuenta",
          variant: "danger",
          show: true,
        });
      })
      .catch();
  };

  return (
    <div className="container-fluid">
      <Welcome
        text={"Cuentas de banco"}
        textButton={"Cuenta"}
        add={() => setModalShow(true)}
      />
      <div className="row mt-4">
        <form
          onSubmit={handleSearch}
          action=""
          ref={form}
          className="form-group row"
        >
          <div className="col-8">
            <FilterTableButtons
              data={banksFilter}
              callback={handleBankChange}
            />
          </div>
          <div className="col-4">
            <SearchBar text="Cuentas" />
          </div>
        </form>
      </div>

      {Array.isArray(banks.data) ? (
        banks.data.length > 0 ? (
          <>
            <div className="row mt-4">
              <div className="col-12">
                <div className="d-flex justify-content-between">
                  <div />
                  <PaginationTable
                    text="cuentas"
                    quantity={banks.last_page}
                    itemsTotal={banks.total}
                    handleChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="d-flex">
                <table className="table TableP table-striped">
                  <thead>
                    <tr className="pt-4">
                      <th scope="col">ID</th>
                      <th scope="col">Encargado</th>
                      <th scope="col">Propietario</th>
                      <th scope="col">Balance</th>
                      <th scope="col">Banco</th>
                      <th scope="col">País</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {banks.data.map((e) => {
                      return (
                        <tr key={e.id}>
                          <td scope="row">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>{e.identifier}</span>
                            </div>
                          </td>
                          <th>
                            {e.user
                              ? e.user.name
                              : e.store.user
                                ? e.store.user.name
                                : "Sin encargado"}
                          </th>
                          <td>{e.name}</td>
                          <td>
                            {formatAmount(e.balance, e.currency.shortcode)}
                          </td>
                          <td>{e.bank.name}</td>
                          <td>{e.bank.country.name}</td>
                          <td>
                            <div className="d-flex justify-content-evenly align-items-center">
                              <button
                                onClick={() => {
                                  setBankAccount(e);
                                  setModalConfirmShow(true);
                                }}
                                className="TableActionButtons ms-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    d="M15.3332 3C15.3332 2.44772 14.8855 2 14.3332 2H11.8158C11.3946 0.804906 10.267 0.0040625 8.99985 0H6.99985C5.73269 0.0040625 4.6051 0.804906 4.18385 2H1.6665C1.11422 2 0.666504 2.44772 0.666504 3C0.666504 3.55228 1.11422 4 1.6665 4H1.99985V12.3333C1.99985 14.3584 3.64147 16 5.6665 16H10.3332C12.3582 16 13.9998 14.3584 13.9998 12.3333V4H14.3332C14.8855 4 15.3332 3.55228 15.3332 3ZM11.9998 12.3333C11.9998 13.2538 11.2537 14 10.3332 14H5.6665C4.74604 14 3.99985 13.2538 3.99985 12.3333V4H11.9998V12.3333Z"
                                    fill="#495057"
                                  />
                                  <path
                                    d="M6.33301 12C6.88529 12 7.33301 11.5523 7.33301 11V7C7.33301 6.44772 6.88529 6 6.33301 6C5.78073 6 5.33301 6.44772 5.33301 7V11C5.33301 11.5523 5.78073 12 6.33301 12Z"
                                    fill="#495057"
                                  />
                                  <path
                                    d="M9.6665 12C10.2188 12 10.6665 11.5523 10.6665 11V7C10.6665 6.44772 10.2188 6 9.6665 6C9.11422 6 8.6665 6.44772 8.6665 7V11C8.6665 11.5523 9.11422 12 9.6665 12Z"
                                    fill="#495057"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="d-flex justify-content-center align-items-center">
            No hay cuentas para mostrar
          </div>
        )
      ) : (
        <div className="mt-4">
          <TableLoader />
        </div>
      )}
      <div className="">
        {modalShow && (
          <ModalCreateBankAccount
            setModalShow={setModalShow}
            modalShow={modalShow}
          />
        )}
        <AlertMessage
          setShow={setAlert}
          message={alert.text}
          variant={alert.variant}
          show={alert.show}
        />
        <ModalConfirmation
          setModalShow={setModalConfirmShow}
          show={modalConfirmShow}
          text={"Cuenta de banco"}
          action={() => handleDelete(bankAccount)}
        />
      </div>
    </div>
  );
};

export default BankAccounts;
