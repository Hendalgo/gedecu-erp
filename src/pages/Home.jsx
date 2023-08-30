import React, { useContext } from 'react'
import { SessionContext } from '../context/SessionContext'
import AddButton from '../components/AddButton'
import './Home.css'
import Title from '../components/Titlte'
import Card from '../components/Card'
import Chart from '../components/Chart'
import { ReactSVG } from 'react-svg'
import BankCard from '../components/BankCard'

const table = [
  {
    id: "1",
    date: "17 Ago, 2023",
    type: "Transferencia",
    payment: "Banco - Mercantil",
    amount: "2.500,00",
    currency: "Bs.S"
  },
  {
    id: "2",
    date: "17 Ago, 2023",
    type: "Transferencia",
    payment: "Banco - Mercantil",
    amount: "2.500,00",
    currency: "Bs.S"
  },
  {
    id: "3",
    date: "17 Ago, 2023",
    type: "Transferencia",
    payment: "Banco - Mercantil",
    amount: "2.500,00",
    currency: "Bs.S"
  },
  {
    id: "4",
    date: "17 Ago, 2023",
    type: "Transferencia",
    payment: "Banco - Mercantil",
    amount: "2.500,00",
    currency: "Bs.S"
  },
  {
    id: "5",
    date: "17 Ago, 2023",
    type: "Transferencia",
    payment: "Banco - Mercantil",
    amount: "2.500,00",
    currency: "Bs.S"
  },
  {
    id: "6",
    date: "17 Ago, 2023",
    type: "Transferencia",
    payment: "Banco - Mercantil",
    amount: "2.500,00",
    currency: "Bs.S"
  },
  {
    id: "7",
    date: "17 Ago, 2023",
    type: "Transferencia",
    payment: "Banco - Mercantil",
    amount: "2.500,00",
    currency: "Bs.S"
  },
]
const Home = () => {
  const {session} = useContext(SessionContext);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="container">
              <div className="row">
                <div className="container">
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
                      <div className="col-4">
                        <Card country="Venezuela - VE" currency="Bs.D" total="10.000,00" img="/venezuela-flag.png" percent="1.01"/>
                      </div>
                      <div className="col-4">
                        <Card country="Colombia - CO" currency="$" total="1.000.000,00" img="/colombia-flag.png" percent="4.01"/>
                      </div>
                      <div className="col-4">
                        <Card country="Efectivo" currency="$" total="1.000.000,00" img="/imoney.png" percent="-2.01"/>
                      </div>
                    </div>
                    <div className="row pt-4">
                      <Title title="Estadísticas" icon="/arrow-grow.svg" description="Estadísticas" />
                    </div>
                    <div className="row pt-4">
                      <Chart />
                    </div>
                    </div>
                    <div className="col-3 mt-4 radius" style={{overflow: "hidden"}}>
                      <div className='BankAmountContainer'>
                        <div className='d-flex
                      flex-column  align-items-center'>
                          <ReactSVG
                            src='/bank.svg'
                            className='TotalAmountBank'
                            wrapper='span'
                          />
                          <h6>Montos Bancarios</h6>
                        </div>
                        <div style={{overflowY: "scroll", maxHeight: 500}} >
                            <BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" />
                            <BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" />
                            <BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" />
                            <BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" />
                            <BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" />
                            <BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" />
                            <BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" /><BankCard amount="2.000,00" currency="Bs.D" name="Banco de Venezuela" icon="/venezuela-bank.png" />
                        </div>
                      </div>
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
                  <button className='DownloadButton'>
                    <ReactSVG 
                      src="/download.svg"
                      wrapper='span'
                      className='DownloadIcon'
                    />
                    Descargar
                  </button>
                </div>
              </div>
              <div className="row pt-4">
                <div className="d-flex">
                  <table className='table TableP table-striped' >
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
                        table.map(e=>
                          <tr key={e.id}>
                            <td scope='row'>{e.id}</td>
                            <td>{e.date}</td>
                            <td>{e.type}</td>
                            <td>{e.payment}</td>
                            <td>{e.amount}</td>
                          </tr>  
                        )
                      }
                    </tbody>
                  </table>
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