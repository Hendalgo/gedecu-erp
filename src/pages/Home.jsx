import React, { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../context/SessionContext'
import AddButton from '../components/AddButton'
import './Home.css'
import Title from '../components/Titlte'
import Card from '../components/Card'
import Chart from '../components/Chart'
import { ReactSVG } from 'react-svg'
import BankCard from '../components/BankCard'
import Header from '../components/Header';
import DownloadButton from '../components/DownloadButton'
import { getReports } from '../helpers/reports'
import { getBanks, getBanksTotal } from '../helpers/banks'
import { useFormatDate } from '../hooks/useFormatDate'
import BalanceLoader from '../components/Loaders/BalanceLoader'
import TableLoader from '../components/Loaders/TableLoader'

const Home = () => {
  const {session} = useContext(SessionContext);
  const [reports, setReports] = useState([]);
  const  [loadingReports, setLoadingReports] = useState(true);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [banks, setBanks] = useState([]);
  const [countriesTotal, setCountriesTotal] = useState([]);
  useEffect(()=>{
    getReports().then( r => setReports(r.data)).finally(()=> setLoadingReports(false));
    getBanks().then(r => setBanks(r.data)).finally(()=> setLoadingBanks(false));
    getBanksTotal().then(r => setCountriesTotal(r));
  }, []);
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="container-fluid">
              <div className="row">
              </div>
              <div className="row">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-9">
                      <div className="row WelcomeContainer pt-4 pb-3">
                      <div className="d-flex justify-content-between">
                        <div className=''>
                          <h6 className='welcome'>Bienvenido, {session.name} 👋</h6>
                          <h4>Vista General</h4>
                        </div>
                        <div className="">
                          <div className="d-flex g-4">
                            <div className="me-4  ">
                              <AddButton />
                            </div>
                            <div >
                              <AddButton />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row pt-4">
                      <Title title="Balances" icon="/chart-histogram.svg" description="Balances" />
                    </div>
                    <div className="pt-4 row">
                      {
                        countriesTotal.length > 0
                        ?countriesTotal.map((e, index)=>
                          <div key={index} className={`col-${Math.floor((12/countriesTotal.length))}`}>
                            <Card country={`${e.country_name} ${e.shortcode}`} currency={e.symbol} total={e.total.toLocaleString('de-DE',{minimumFractionDigits: 2})} img="/venezuela-flag.png" percent="1.01"/>
                          </div>
                        )
                        :<>
                          <div className='col-4'>
                            <BalanceLoader/>
                          </div>
                          <div className='col-4'>
                            <BalanceLoader/>
                          </div>
                          <div className='col-4'>
                            <BalanceLoader/>
                          </div>
                        </>
                      }
                    </div>
                    <div className="row pt-4">
                      <Title title="Estadísticas" icon="/arrow-grow.svg" description="Estadísticas" />
                    </div>
                    <div className="row pt-4">
                      <Chart />
                    </div>
                    </div>
                    <div className="col-3 mt-4 radius" style={{overflow: "hidden"}}>
                      {
                        loadingBanks?<TableLoader height={1400}/>
                        :<div className='BankAmountContainer'>
                          <div className='d-flex
                        flex-column  align-items-center BankAmountTop'>
                            <ReactSVG
                              src='/bank.svg'
                              className='TotalAmountBank'
                              wrapper='span'
                            />
                            <h6>Montos Bancarios</h6>
                          </div>
                          <div style={{overflowY: "scroll", maxHeight: 500}} >
                              {
                                banks.length > 0 
                                ?banks.map( e =>
                                  <BankCard key={e.id} amount={e.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} currency={e.country.currency.symbol} name={e.name} icon="/venezuela-bank.png" />
                                )
                                :null
                              }
                          </div>
                        </div>
                      }
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
                  <DownloadButton />
                </div>
              </div>
              <div className="row pt-4 pb-2">
                <div className="d-flex">
                  {
                    loadingReports?<TableLoader/>
                    :<table className='table TableP table-striped' >
                      <thead>
                        <tr>
                          <th scope='col'>ID Transacción</th>
                          <th scope='col'>Fecha</th>
                          <th scope='col'>Motivo</th>
                          <th scope='col'>Método de pago</th>
                          <th scope='col'>Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          reports || reports.legth === 0
                          ?reports.map(e=>
                            <tr key={e.id}>
                              <td scope='row'>{e.id}</td>
                              <td>{useFormatDate(e.created_at)}</td>
                              <td ><span className='ReportTypeTableStyle' style={{color: JSON.parse(e.type.config).styles.color, backgroundColor: JSON.parse(e.type.config).styles.backgroundColor, borderColor: JSON.parse(e.type.config).styles.borderColor}}>{e.type.name}</span></td>
                              <td><span className="ReportTypeTableStyle"  style={{color: '#2E2C34', backgroundColor: '#EFEDF4', borderColor: '#E0DCEA'}}>{e.bank.name}</span></td>
                              <td>{`${e.bank.country.currency.symbol} ${e.bank.amount.toLocaleString('de-DE',{ minimumFractionDigits: 2})}`}</td>
                            </tr>  
                          )
                          :'No hay reportes que mostrar'
                        }
                      </tbody>
                    </table>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home