import React, { useContext, useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { SessionContext } from '../context/SessionContext'
import FilterTableButtons from '../components/FilterTableButtons'
import SearchBar from '../components/SearchBar'
import PaginationTable from '../components/PaginationTable'
import { Outlet } from 'react-router-dom'
import { getReportTypes, getReports, updateReport } from '../helpers/reports'
import { useFormatDate } from '../hooks/useFormatDate'
import ModalViewReport from '../components/ModalViewReport'
import Welcome from '../components/Welcome'
import ModalCreateReport from '../components/ModalCreateReport'
import TableLoader from '../components/Loaders/TableLoader'
const DuplicateReports = () => {
  const { session } = useContext(SessionContext)
  const [report, setReport] = useState()
  const [offset, setOffset] = useState(1)
  const [reportType, setReportType] = useState([
    {
      id: 'done',
      name: 'Correcto'
    },
    {
      id: 'cancel',
      name: 'Cancelado'
    }
  ])
  const [modalShow, setModalShow] = useState(false)
  const [modalCreateShow, setModalCreateShow] = useState(false)
  const [reports, setReports] = useState([])
  const form = useRef()
  useEffect(() => {
    getReports('order=created_at&order_by=desc&duplicated=yes').then(r => setReports(r))
  }, [])
  const handleChange = (offset) => {
    setOffset(offset.selected + 1)
    getReports(`order=created_at&order_by=desc&page=${offset.selected + 1}&duplicated=yes${form.current.filter_type.value !== 'false' ? `&duplicated_status=${form.current.filter_type.value}` : ''}&search=${form.current.search.value}`).then(r => setReports(r))
  }
  const handleModal = (id) => {
    setReport(reports.data.find((el) => el.id === id))
    setModalShow(true)
  }
  const handleType = (e) => {
    getReports(`order=created_at&order_by=desc&duplicated=yes${e ? `&duplicated_status=${e}` : ''}&search=${form.current.search.value}`).then(r => setReports(r))
  }
  const handleSearch = (e) => {
    e.preventDefault()
    if (form.current.search !== '') {
      getReports(`order=created_at&order_by=desc&duplicated=yes${form.current.filter_type.value !== 'false' ? `&duplicated_status=${form.current.filter_type.value}` : ''}&search=${form.current.search.value}`).then(r => setReports(r))
    }
  }
  const handleDone = (id) => {
    updateReport({
      duplicated_status: 'done'
    }, id).then(r => console.log())

    getReports(`order=created_at&order_by=desc&page=${offset.selected + 1}&duplicated=yes${form.current.filter_type.value !== 'false' ? `&duplicated_status=${form.current.filter_type.value}` : ''}&search=${form.current.search.value}`).then(r => setReports(r))
  }
  const handleCancel = (id) => {
    updateReport({
      duplicated_status: 'cancel'
    }, id).then(r => console.lo())

    getReports(`order=created_at&order_by=desc&page=${offset.selected + 1}&duplicated=yes${form.current.filter_type.value !== 'false' ? `&duplicated_status=${form.current.filter_type.value}` : ''}&search=${form.current.search.value}`).then(r => setReports(r))
  }
  return (
    <>
      <div className='container-fluid'>
        <Welcome text='Reportes duplicados' add={() => setModalCreateShow(true)} textButton='Reporte' />
        <div className='row mt-4'>
          <form onSubmit={handleSearch} action='' ref={form} className='form-group row'>
            <div className='col-8'><FilterTableButtons data={reportType} callback={handleType} /></div>
            <div className='col-4'><SearchBar text='reportes' /></div>
          </form>
        </div>
        {
        Array.isArray(reports.data)
          ? reports.data.length > 0

            ? <>
              <div className='row mt-4'>
                <div className='col-12'>
                  <div className='d-flex justify-content-between'>
                    <div />
                    <PaginationTable itemOffset={offset} quantity={reports.last_page} itemsTotal={reports.total} handleChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className='row mt-2'>
                <div className='table-responsive'>
                  <table className='table TableP table-borderless align-middle'>
                    <thead className=''>
                      <tr className='pt-4'>
                        <th scope='col'>ID Transacción</th>
                        <th scope='col'>Fecha</th>
                        <th scope='col'>Motivo</th>
                        <th scope='col'>Método de pago</th>
                        <th scope='col'>Monto</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {
                  reports.data.map(e => {
                    const color = JSON.parse(e.type.config).styles
                    let currency
                    if (e.bank_income) {
                      currency = e.bank_income.country.currency.symbol
                    } else {
                      currency = e.bank.country.currency.symbol
                    }
                    return (
                      <tr key={e.id}>
                        <td scope='row'>
                          <div className='d-flex justify-content-between align-items-center'>
                            <span>{e.id}</span>
                            <span>
                              <button className='btn' onClick={() => handleModal(e.id)}>
                                <svg xmlns='http://www.w3.org/2000/svg' width='17' height='13' viewBox='0 0 17 13' fill='none'>
                                  <path d='M15.7875 4.42276C14.1685 1.92492 11.4045 0.405734 8.42802 0.377808C5.45154 0.405734 2.68754 1.92492 1.06859 4.42276C0.215419 5.67484 0.215419 7.32149 1.06859 8.5736C2.68663 11.073 5.45079 12.5937 8.42805 12.6226C11.4045 12.5946 14.1685 11.0755 15.7875 8.57762C16.6425 7.3246 16.6425 5.67575 15.7875 4.42276ZM14.1309 7.43838C12.8949 9.39888 10.7456 10.595 8.42802 10.6122C6.11048 10.595 3.9612 9.39888 2.72514 7.43838C2.3398 6.87226 2.3398 6.12809 2.72514 5.562C3.96116 3.60151 6.11045 2.4054 8.42802 2.38822C10.7456 2.40537 12.8948 3.60151 14.1309 5.562C14.5162 6.12809 14.5162 6.87226 14.1309 7.43838Z' fill='#0D6EFD' />
                                  <path d='M8.4281 9.18066C9.90852 9.18066 11.1086 7.98054 11.1086 6.50012C11.1086 5.0197 9.90852 3.81958 8.4281 3.81958C6.94768 3.81958 5.74756 5.0197 5.74756 6.50012C5.74756 7.98054 6.94768 9.18066 8.4281 9.18066Z' fill='#0D6EFD' />
                                </svg>
                              </button>
                            </span>
                          </div>
                        </td>
                        <td>{useFormatDate(e.created_at)}</td>
                        <td>
                          <span style={{ borderColor: color.borderColor, backgroundColor: color.backgroundColor, color: color.color, padding: '2px 8px', borderRadius: '4px' }}>{e.type.name}</span>
                        </td>
                        <td>{e.bank.name}</td>
                        <td>{currency} {e.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                        <td>
                          <div className='d-flex justify-content-evenly align-items-center'>
                            {
                                    e.duplicated_status === null
                                      ? <>
                                        <button onClick={() => handleDone(e.id)} className='TableActionButtonsDone'>
                                          <svg xmlns='http://www.w3.org/2000/svg' width='17' height='12' viewBox='0 0 17 12' fill='none'>
                                            <path d='M5.54113 11.775C5.08695 11.7752 4.65138 11.5947 4.3305 11.2733L0.670374 7.6145C0.276542 7.22054 0.276542 6.58193 0.670374 6.18797C1.06433 5.79414 1.70294 5.79414 2.09689 6.18797L5.54113 9.63221L14.6531 0.520227C15.0471 0.126396 15.6857 0.126396 16.0796 0.520227C16.4735 0.914185 16.4735 1.55279 16.0796 1.94675L6.75175 11.2733C6.43087 11.5947 5.9953 11.7752 5.54113 11.775Z' fill='#198754' />
                                          </svg>
                                        </button>
                                        <button onClick={() => handleCancel(e.id)} className='TableActionButtonsCancel'>
                                          <svg xmlns='http://www.w3.org/2000/svg' width='17' height='16' viewBox='0 0 17 16' fill='none'>
                                            <path d='M9.78941 8.00022L16.0825 1.70782C16.4731 1.31718 16.4731 0.683833 16.0825 0.293224C15.6919 -0.0974159 15.0585 -0.0974159 14.6679 0.293224L8.37546 6.58628L2.08307 0.293224C1.69243 -0.0974159 1.05908 -0.0974159 0.668468 0.293224C0.277859 0.683865 0.277828 1.31721 0.668468 1.70782L6.96152 8.00022L0.668468 14.2926C0.277828 14.6833 0.277828 15.3166 0.668468 15.7072C1.05911 16.0979 1.69246 16.0979 2.08307 15.7072L8.37546 9.41416L14.6679 15.7072C15.0585 16.0979 15.6919 16.0979 16.0825 15.7072C16.4731 15.3166 16.4731 14.6833 16.0825 14.2926L9.78941 8.00022Z' fill='#DC3545' />
                                          </svg>
                                        </button>
                                        </>
                                      : null
                                  }
                          </div>
                        </td>
                      </tr>
                    )
                  }
                  )
                }
                    </tbody>
                  </table>
                </div>
              </div>
            </>
            : <div className='d-flex justify-content-center align-items-center'>No hay reportes para mostrar</div>
          : <div className='mt-4'><TableLoader /></div>
        }
        <div className=''>
          <ModalViewReport setModalShow={setModalShow} modalShow={modalShow} report={report} />
          <ModalCreateReport setModalShow={setModalCreateShow} modalShow={modalCreateShow} />
        </div>
      </div>
    </>
  )
}

export default DuplicateReports
