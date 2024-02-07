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
import { getTotalAmountByBank } from "../helpers/banks";
import BalanceLoader from "../components/Loaders/BalanceLoader";
import TableLoader from "../components/Loaders/TableLoader";
import ModalCreateUser from "../components/ModalCreateUser";
import { useCheckRole } from "../hooks/useCheckRole";
import { useNavigate } from "react-router-dom";
import { DASHBOARD_ROUTE, REPORTS_ROUTE } from "../consts/Routes";
import ReportsTable from "../components/ReportsTable";
import ReportsByUserTable from "../components/ReportsByUserTable";
import { getTotalAmountByCurrency } from "../helpers/currencies";

const Home = () => {
  const { session } = useContext(SessionContext);
  const [reports, setReports] = useState(null);
  const [modalUser, setModalUser] = useState(false);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [banks, setBanks] = useState([]);
  const [currencies, setCurrencies] = useState([]);
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
    <div className="container-fluid">
      <section className="row">
        <div className="col">
          <div className="topClass">
            <div className="row WelcomeContainer">
              <div className="pt-4 pb-3 d-flex justify-content-between">
                <div>
                  <h6 className="welcome">Bienvenido, {session.name} 👋</h6>
                  <h4>Vista General</h4>
                </div>
                {
                  useCheckRole(session) &&
                  <AddButton
                    text="Usuario"
                    add={() => {setModalUser(true)}}
                  />
                }
                {
                  !useCheckRole(session) &&
                  <AddButton
                    text="Reporte"
                    add={() => navigate(`/${DASHBOARD_ROUTE}/${REPORTS_ROUTE}/create`)}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="row pt-4">
        <div className="col-10">
          {
            useCheckRole(session) &&
            <>
              <div className="row">
                <Title
                  title="Balances"
                  icon="/chart-histogram.svg"
                  description="Balances por monedas"
                />
              </div>
              <div
                className="py-2 d-flex justify-content-between mb-4"
                style={{ overflowX: "scroll", gap: "3%" }}
              >
                {
                  loadingCurrencies ?
                  <>
                    <div className="col-4"><BalanceLoader /></div>
                    <div className="col-4"><BalanceLoader /></div>
                    <div className="col-4"><BalanceLoader /></div>
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
          }
          <div className="row">
            <Title
              title="Estadísticas"
              icon="/arrow-grow.svg"
              description="Movimientos de dinero por moneda"
            />
          </div>
          <div className="py-2 mb-3">
            <Chart />
          </div>
        </div>
        {
          (useCheckRole(session)) &&
          <aside className="col-2 radius overflow-hidden overflow-y-auto" style={{ maxHeight: "90vh" }}>
            {
              loadingBanks ?
              <TableLoader height={1400} /> :
                <div className="BankAmountContainer">
                  <div className="d-flex flex-column align-items-center BankAmountTop" >
                    <ReactSVG src="/bank.svg" className="TotalAmountBank" wrapper="span" />
                    <h6>Montos Bancarios</h6>
                  </div>
                  <div style={{ overflowY: "scroll", maxHeight: 500 }} >
                    {
                      banks.map((bank, index) => {
                        return <BankCard key={index} {...bank} />
                      })
                    }
                  </div>
                </div>
            }
          </aside>
        }
      </section>
      <section>
        <div className="row">
          <Title
            title="Últimas transacciones"
            icon="/refresh.svg"
            description="Reportes más recientes"
          />
        </div>
        <div className="pb-2">
          {
            session.role_id === 1 ?
            <ReportsTable loading={loadingReports} data={reports} /> :
            <ReportsByUserTable loading={loadingReports} data={reports} />
          }
        </div>
      </section>
      <ModalCreateUser setModalShow={setModalUser} modalShow={modalUser} />
    </div>
  );
};

export default Home;
