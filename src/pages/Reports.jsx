import React, { useContext } from 'react'
import Header from '../components/Header'
import AddButton from '../components/AddButton'
import { ALL_CATEGORIES } from '../consts/Categorys'
import { SessionContext } from '../context/SessionContext'
import DownloadButton from '../components/DownloadButton'
import FilterTableButtons from '../components/FilterTableButtons'

const data = [
  {
    id: 0,
    title: ALL_CATEGORIES.title,
    num: 10
  },
  {
    id: 2,
    title: "Petición transferencia",
    num: 2
  },
  {
    id: 3,
    title: "Transferencia enviada",
    num: 4
  },
  {
    id: 4,
    title: "Caja fuerte",
    num: 4
  },
  {
    id: 5,
    title: "Depositante",
    num: 2
  }
]

const Reports = () => {
  const {session} = useContext(SessionContext);
  return (
    <div className="container-fluid">
         
      <div className="row WelcomeContainer pt-4 pb-3">
        <div className="d-flex justify-content-between">
          <div className=''>
            <h6 className='welcome'>Bienvenido, {session.name} 👋</h6>
            <h4>Vista General</h4>
          </div>
          <div className="">
            <div className="d-flex align-items-center g-4">
              <div className="me-4  ">
                <DownloadButton />
              </div>
                <AddButton />
              <div >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-10"><FilterTableButtons data={data} callback={()=> console.log("Qlq")}/></div>
        <div className="col-2"></div>
      </div>
      <div className="row"></div>
      <div className="row"></div>
    </div>
  )
}

export default Reports