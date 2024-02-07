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
import { getBanks, getTotalAmountByBank } from "../helpers/banks";
import { useFormatDate } from "../hooks/useFormatDate";
import BalanceLoader from "../components/Loaders/BalanceLoader";
import TableLoader from "../components/Loaders/TableLoader";
import ModalCreateUser from "../components/ModalCreateUser";
import { useCheckRole } from "../hooks/useCheckRole";
import { getCountriesTotal } from "../helpers/countries";
import { useNavigate } from "react-router-dom";
import { DASHBOARD_ROUTE, REPORTS_ROUTE } from "../consts/Routes";
import ReportsTable from "../components/ReportsTable";
import ReportsByUserTable from "../components/ReportsByUserTable";
import { getTotalAmountByCurrency } from "../helpers/currencies";
import { getMovementStatistics } from "../helpers/statistics";

const Home = () => {
  const { session } = useContext(SessionContext);
  const [reports, setReports] = useState(null);
  const [modalReport, setModalReport] = useState(false);
  const [modalUser, setModalUser] = useState(false);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [banks, setBanks] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const topClass = useCheckRole(session) ? "col-9" : "col-12";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const promises = [getTotalAmountByCurrency() ,getReports(`order=created_at&order_by=desc`),];

      if (session.role_id == 1) promises.push(getTotalAmountByBank(),);

      try {
        const [currenciesResponse, reportsResponse, banksResponse,] = await Promise.allSettled(promises);

        if (currenciesResponse.status == "fulfilled") {
          setCurrencies(currenciesResponse.value);
        }

        if (reportsResponse.status == "fulfilled") {
          setReports(reportsResponse.value);
        }

        if (banksResponse && banksResponse.status == "fulfilled") {
          setBanks(banksResponse.value);
        }

        setLoadingCurrencies(false);
        setLoadingReports(false);
        setLoadingBanks(false);

      } catch (err) {
        if (err.response) {
          const { errors, message } = err.response.data;
          if (errors) {
            console.log(errors)
          } else {
            console.log(message)
          }
        } else {
          console.log("Message:", err.message);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="container-fluid">
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
                                <div className="">
                                  <AddButton
                                    text="Usuario"
                                    add={() => {
                                      setModalUser(true);
                                    }}
                                  />
                                </div>
                              )}
                              {
                                !useCheckRole(session) &&
                                <div className="ms-4">
                                  <AddButton
                                    text="Reporte"
                                    add={() => navigate(`/${DASHBOARD_ROUTE}/${REPORTS_ROUTE}/create`)}
                                  />
                                </div>
                              }
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
                            className="pt-4 py-2 d-flex justify-content-between"
                            style={{ overflowX: "scroll", gap: "3%" }}
                          >
                            {
                              loadingCurrencies ?
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
                              </> :
                              currencies.map(({currency, total}, index) => {
                                return <div key={index} className="">
                                  <Card
                                    currency={`${currency.name} - ${currency.shortcode}`}
                                    total={total}
                                    percent={2}
                                     />
                                </div>
                              })
                            }
                          </div>
                        </>
                      )}
                    </div>
                    {useCheckRole(session) && (
                      <div
                        className="col-3 mt-4 radius"
                        style={{ overflow: "hidden", overflowY: "auto", maxHeight: "400px" }}
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
                              {
                                banks.map((bank, index) => {
                                  return <BankCard key={index} {...bank} />
                                })
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row pt-4 mb-4">
                <div className="d-flex justify-content-between">
                  <Title
                    title="Estadísticas"
                    icon="/arrow-grow.svg"
                    description="Estadísticas"
                  />
                </div>
                <div className='row pt-4'><Chart /></div>
              </div>
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
          </div>
        </div>
        <div className="row pb-2">
          {
            session.role_id === 1 ?
            <ReportsTable loading={loadingReports} data={reports} /> :
            <ReportsByUserTable loading={loadingReports} data={reports} />
          }
        </div>
      </div>
      <ModalCreateUser setModalShow={setModalUser} modalShow={modalUser} />
    </>
  );
};

export default Home;
