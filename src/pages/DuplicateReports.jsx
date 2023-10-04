import React, {useContext, useState} from 'react'
import AddButton from '../components/AddButton'
import { ALL_CATEGORY, CATEGORIES } from '../consts/ReportsCategories'
import { SessionContext } from '../context/SessionContext'
import DownloadButton from '../components/DownloadButton'
import FilterTableButtons from '../components/FilterTableButtons'
import SearchBar from '../components/SearchBar'
import PaginationTable from '../components/PaginationTable'
import { Modal } from 'react-bootstrap'
const data = [
  {
    id: 0,
    title: ALL_CATEGORY.title,
    num: 10
  },
  {
    id: 1,
    title: "Reembolsados",
    num: 2
  },
  {
    id: 2,
    title: "Cancelado",
    num: 4
  }
]
const table = [
  {
    id: "1",
    date: "17 Ago, 2023",
    type: 1,
    payment: "Banco - Mercantil",
    amount: "2.500,00",
    currency: "Bs.S"
  },
  {
    id: "2",
    date: "17 Ago, 2023",
    type: 2,
    payment: "Banco - Mercantil",
    amount: "2.500,00",
    currency: "Bs.S"
  },
  {
    id: "3",
    date: "17 Ago, 2023",
    type: 3,
    payment: "Banco - Mercantil",
    amount: "2.500,00",
    currency: "Bs.S"
  },
  {
    id: "4",
    date: "17 Ago, 2023",
    type: 4,
    payment: "Banco - Mercantil",
    amount: "2.500,00",
    currency: "Bs.S"
  },
  {
    id: "5",
    date: "17 Ago, 2023",
    type: 5,
    payment: "Banco - Mercantil",
    amount: "2.500,00",
    currency: "Bs.S"
  },
  {
    id: "6",
    date: "17 Ago, 2023",
    type: 6,
    payment: "Banco - Mercantil",
    amount: "2.500,00",
    currency: "Bs.S"
  },
  {
    id: "7",
    date: "17 Ago, 2023",
    type: 7,
    payment: "Banco - Mercantil",
    amount: "2.500,00",
    currency: "Bs.S"
  },
]

const DuplicateReports = () => {
  const {session} = useContext(SessionContext);
  const [itemOffset, setItemsOffset] = useState(0);
  const [modalShow, setModalShow] = useState(false)
  const handleChange = (offset)=>{
    console.log(offset);
  }
  const handleModal = (e)=>{
    setModalShow(true);
  }
  return (
    <div className="container-fluid">
         
      <div className="row WelcomeContainer pt-4 pb-3">
        <div className="d-flex justify-content-between">
          <div className=''>
            <h6 className='welcome'>Bienvenido, {session.name} 👋</h6>
            <h4>Reportes Duplicados</h4>
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
        <div className="col-8"><FilterTableButtons data={data} callback={()=> console.log("Qlq")}/></div>
        <div className="col-4"><SearchBar text="reportes" /></div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <div className="d-flex justify-content-between">
            <div>
            </div>
            <PaginationTable quantity={85} itemOffset={itemOffset} handleChange={handleChange} />
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="d-flex">
          <table className='table TableP table-striped' >
            <thead>
              <tr className='pt-4'>
                <th scope='col'>ID Transacción</th>
                <th scope='col'>Fecha</th>
                <th scope='col'>Motivo</th>
                <th scope='col'>Método de pago</th>
                <th scope='col'>Monto</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                table.map(e=>
                  {
                    const category = CATEGORIES.find(el => el.id === e.type);
                    return(<tr key={e.id}>
                            <td scope='row'>
                              <div className="d-flex justify-content-between align-items-center">
                                <span>{e.id}</span>
                                <span>
                                  <button className='btn' onClick={()=> handleModal(e.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="13" viewBox="0 0 17 13" fill="none">
                                      <path d="M15.7875 4.42276C14.1685 1.92492 11.4045 0.405734 8.42802 0.377808C5.45154 0.405734 2.68754 1.92492 1.06859 4.42276C0.215419 5.67484 0.215419 7.32149 1.06859 8.5736C2.68663 11.073 5.45079 12.5937 8.42805 12.6226C11.4045 12.5946 14.1685 11.0755 15.7875 8.57762C16.6425 7.3246 16.6425 5.67575 15.7875 4.42276ZM14.1309 7.43838C12.8949 9.39888 10.7456 10.595 8.42802 10.6122C6.11048 10.595 3.9612 9.39888 2.72514 7.43838C2.3398 6.87226 2.3398 6.12809 2.72514 5.562C3.96116 3.60151 6.11045 2.4054 8.42802 2.38822C10.7456 2.40537 12.8948 3.60151 14.1309 5.562C14.5162 6.12809 14.5162 6.87226 14.1309 7.43838Z" fill="#0D6EFD"/>
                                      <path d="M8.4281 9.18066C9.90852 9.18066 11.1086 7.98054 11.1086 6.50012C11.1086 5.0197 9.90852 3.81958 8.4281 3.81958C6.94768 3.81958 5.74756 5.0197 5.74756 6.50012C5.74756 7.98054 6.94768 9.18066 8.4281 9.18066Z" fill="#0D6EFD"/>
                                    </svg>
                                  </button>
                                </span>
                              </div>
                            </td>
                            <td>{e.date}</td>
                            <td>
                            <span style={{border: category.borderColor, backgroundColor: category.backgroundColor, color: category.color, padding: "2px 8px", borderRadius: "4px"}}>{category.title}</span></td>
                            <td>{e.payment}</td>
                            <td>{e.amount}</td>
                            <td></td>
                          </tr>)  
                  }
                )
              }
            </tbody>
          </table>
          <div className="">
              <Modal show={modalShow} size='lg' onHide={()=> setModalShow(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    <div className="container">
                      <div className="row">
                        <div className='d-flex flex-column'>
                          <span className='ModalTopTitle'>ID #0000</span>
                          <span className='ModalTopSubTitle'>19 Ago, 2023</span>
                        </div>
                      </div>
                    </div>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="container mt-4">
                    <div className="row">
                      <div className="col-3">
                        <div className="d-flex flex-column">
                          <span className='ModalBodyTitle mb-1'>Metodo de pago</span>
                          <span className='ModalBodyContent'>Banco - Mercantil</span>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="d-flex flex-column">
                          <span className='ModalBodyTitle mb-1'>Monto</span>
                          <span className='ModalBodyContent'>Bs.S 2.500,00</span>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="d-flex flex-column">
                          <span className='ModalBodyTitle mb-1'>Tasa del día</span>
                          <span className='ModalBodyContent'>Bs.S 32,00</span>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="d-flex flex-column">
                          <span className='ModalBodyTitle mb-1'>Local</span>
                          <span className='ModalBodyContent'>Local #1</span>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                    <div className="col-3">
                        <div className="d-flex flex-column">
                          <span className='ModalBodyTitle mb-1'>Cuenta de</span>
                          <span className='ModalBodyContent'>Encargado - Luis</span>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="d-flex flex-column">
                          <span className='ModalBodyTitle mb-1'>Recibido de</span>
                          <span className='ModalBodyContent'>Luis X</span>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="d-flex flex-column">
                          <span className='ModalBodyTitle mb-1'>N. Referencia</span>
                          <span className='ModalBodyContent'>16898946213684</span>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="d-flex flex-column">
                          <span className='ModalBodyTitle mb-1'>Motivo</span>
                          <span className='ModalBodyContent'></span>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="d-flex flex-column">
                        <span className='ModalBodyTitle mb-1'>Notas</span>
                        <span className='ModalBodyContent'>Odio et nisl volutpat mauris ac sodales. Tempus nunc euismod ipsum commodo orci mattis nec sed at. Ullamcorper in interdum.</span>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button className='btn btn-primary'>Editar</button>
                </Modal.Footer>
              </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DuplicateReports