import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../context/SessionContext";
import AddButton from "../components/AddButton";
import "./Home.css";
import Title from "../components/Title";
import Card from "../components/Card";
import Chart from "../components/Chart";
import { ReactSVG } from "react-svg";
import BankCard from "../components/BankCard";
import DownloadButton from "../components/DownloadButton";
import { getReports } from "../helpers/reports";
import { getBanks } from "../helpers/banks";
import { useFormatDate } from "../hooks/useFormatDate";
import BalanceLoader from "../components/Loaders/BalanceLoader";
import TableLoader from "../components/Loaders/TableLoader";
import ModalCreateReport from "../components/ModalCreateReport";
import ModalCreateUser from "../components/ModalCreateUser";
import { useCheckRole } from "../hooks/useCheckRole";
import { getCountriesTotal } from "../helpers/countries";

const Home = () => {
  const { session } = useContext(SessionContext);
  const [reports, setReports] = useState([]);
  const [modalReport, setModalReport] = useState(false);
  const [modalUser, setModalUser] = useState(false);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [banks, setBanks] = useState([]);
  const [countriesTotal, setCountriesTotal] = useState([]);
  const topClass = useCheckRole(session) ? "col-9" : "col-12";

  useEffect(() => {
    const fetchData = async () => {
      const [banksResponse] = await Promise.all([
        // getBanks(),
        // getReports(),
        // getCountriesTotal(),
      ]);

      if (banksResponse) {
        setBanks(banksResponse.data);
      }

      setLoadingBanks(false);
      setLoadingReports(false);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="container-fluid">
              <div className="row" />
              <div className="row">
                <div className="container-fluid">
                  <div className="row">
                    <div className={topClass}>
                      <div className="row WelcomeContainer pt-4 pb-3">
                        <div className="d-flex justify-content-between">
                          <div className="">
                            <h6 className="welcome">
                              Bienvenido, {session.name} 👋
                            </h6>
                            <h4>Vista General</h4>
                          </div>
                          <div className="">
                            <div className="d-flex g-4">
                              {useCheckRole(session) && (
                                <div className="me-4  ">
                                  <AddButton
                                    text="Usuario"
                                    add={() => {
                                      setModalUser(true);
                                    }}
                                  />
                                </div>
                              )}
                              <div>
                                <AddButton
                                  text="Reporte"
                                  add={() => {
                                    setModalReport(true);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {useCheckRole(session) && (
                        <>
                          <div className="row pt-4">
                            <Title
                              title="Balances"
                              icon="/chart-histogram.svg"
                              description="Balances"
                            />
                          </div>
                          <div
                            className="pt-4 d-flex"
                            style={{ overflowX: "scroll" }}
                          >
                            {countriesTotal.length > 0 ? (
                              countriesTotal.map((e, index) => (
                                <div key={index} className={`col me-4`}>
                                  <Card
                                    country={`${e.country_name} ${e.shortcode}`}
                                    currency={`${e.currency_shortcode} ${e.symbol}`}
                                    total={e.total.toLocaleString("de-DE", {
                                      minimumFractionDigits: 2,
                                    })}
                                    img="/fi-br-money.png"
                                    percent={e.growth_percentage}
                                  />
                                </div>
                              ))
                            ) : (
                              <>
                                <div className="col-4">
                                  <BalanceLoader />
                                </div>
                                <div className="col-4">
                                  <BalanceLoader />
                                </div>
                                <div className="col-4">
                                  <BalanceLoader />
                                </div>
                              </>
                            )}
                          </div>
                        </>
                      )}
                      <div className="row pt-4">
                        <Title
                          title="Estadísticas"
                          icon="/arrow-grow.svg"
                          description="Estadísticas"
                        />
                      </div>
                      {/* <div className='row pt-4'>
                        <Chart />
                      </div> */}
                    </div>
                    {useCheckRole(session) && (
                      <div
                        className="col-3 mt-4 radius"
                        style={{ overflow: "hidden" }}
                      >
                        {loadingBanks ? (
                          <TableLoader height={1400} />
                        ) : (
                          <div className="BankAmountContainer">
                            <div
                              className="d-flex
                          flex-column  align-items-center BankAmountTop"
                            >
                              <ReactSVG
                                src="/bank.svg"
                                className="TotalAmountBank"
                                wrapper="span"
                              />
                              <h6>Montos Bancarios</h6>
                            </div>
                            <div
                              style={{ overflowY: "scroll", maxHeight: 500 }}
                            >
                              {banks.length > 0
                                ? banks.map(
                                    (e) => (
                                      <BankCard
                                        key={e.id}
                                        amount={e.amount.toLocaleString(
                                          "de-DE",
                                          { minimumFractionDigits: 2 },
                                        )}
                                        currency={``}
                                        name={e.name}
                                      />
                                    ),
                                    // <BankCard key={e.id} amount={e.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} currency={`${e.currency.shortcode} ${e.currency.symbol}`} name={e.name} />
                                  )
                                : null}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row pt-4">
                <div className="d-flex justify-content-between">
                  <Title
                    title="Últimas transacciones"
                    icon="/refresh.svg"
                    description="Transacciones realizadas"
                  />
                  {/* <DownloadButton /> */}
                </div>
              </div>
              <div className="row pt-4 pb-2">
                <div className="d-flex">
                  {loadingReports ? (
                    <TableLoader />
                  ) : (
                    <table className="table TableP table-striped">
                      <thead>
                        <tr>
                          <th scope="col">Usuario</th>
                          <th scope="col">Fecha</th>
                          <th scope="col">Motivo</th>
                          <th scope="col">Método de pago</th>
                          <th scope="col">Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports || reports.legth === 0 ? (
                          reports.map((e) => {
                            let currency;
                            if (e.bank_income) {
                              currency = e.bank_income.bank.currency.symbol;
                            } else {
                              currency = e.bank_account.bank.currency.symbol;
                            }
                            return (
                              <tr key={e.id}>
                                <td scope="row">{e.user.name}</td>
                                <td>{useFormatDate(e.created_at)}</td>
                                <td>
                                  <span
                                    className="ReportTypeTableStyle"
                                    style={{
                                      color: JSON.parse(e.type.config).styles
                                        .color,
                                      backgroundColor: JSON.parse(e.type.config)
                                        .styles.backgroundColor,
                                      borderColor: JSON.parse(e.type.config)
                                        .styles.borderColor,
                                    }}
                                  >
                                    {e.type.name}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className="ReportTypeTableStyle"
                                    style={{
                                      color: "#2E2C34",
                                      backgroundColor: "#EFEDF4",
                                      borderColor: "#E0DCEA",
                                    }}
                                  >
                                    {e.bank_account.bank.name}
                                  </span>
                                </td>
                                <td>{`${currency} ${e.amount.toLocaleString("de-DE", { minimumFractionDigits: 2 })}`}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={5}>No hay reportes que mostrar</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <ModalCreateUser setModalShow={setModalUser} modalShow={modalUser} />
        <ModalCreateReport setModalShow={setModalReport} modalShow={modalReport} /> */}
      </div>
    </>
  );
};

export default Home;
