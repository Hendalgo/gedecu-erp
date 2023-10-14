import React, { useContext, useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { SessionContext } from '../context/SessionContext'
import FilterTableButtons from '../components/FilterTableButtons'
import SearchBar from '../components/SearchBar'
import PaginationTable from '../components/PaginationTable'
import { Outlet } from 'react-router-dom'
import { getReportTypes, getReports } from '../helpers/reports'
import { useFormatDate } from '../hooks/useFormatDate'
import ModalViewReport from '../components/ModalViewReport'
import Welcome from '../components/Welcome'
import ModalCreateReport from '../components/ModalCreateReport'
import TableLoader from '../components/Loaders/TableLoader'

const Reports = () => {
  return <Outlet />
}

export const ReportsIndex = () => {
  const { session } = useContext(SessionContext)
  const [report, setReport] = useState()
  const [reportType, setReportType] = useState([])
  const [modalShow, setModalShow] = useState(false)
  const [modalCreateShow, setModalCreateShow] = useState(false)
  const [reports, setReports] = useState([])
  const form = useRef()

  useEffect(() => {
    getReportTypes().then(r => setReportType(r))
    getReports('order=created_at&order_by=desc').then(r => setReports(r))
  }, [])
  const handleChange = (offset) => {
    getReports(`order=created_at&order_by=desc&page=${offset.selected + 1}${form.current.filter_type.value !== 'false' ? `&type_id=${form.current.filter_type.value}` : ''}&search=${form.current.search.value}`).then(r => setReports(r))
  }
  const handleModal = (id) => {
    setReport(reports.data.find((el) => el.id === id))
    setModalShow(true)
  }
  const handleType = (e) => {
    getReports(`order=created_at&order_by=desc${e ? `&type_id=${e}` : ''}&search=${form.current.search.value}`).then(r => setReports(r))
  }
  const handleSearch = (e) => {
    e.preventDefault()
    if (form.current.search !== '') {
      getReports(`order=created_at&order_by=desc${form.current.filter_type.value !== 'false' ? `&type_id=${form.current.filter_type.value}` : ''}&search=${form.current.search.value}`).then(r => setReports(r))
    }
  }
  return (
    <>
      <div className='container-fluid'>
        <Welcome text='Reportes' add={() => setModalCreateShow(true)} textButton='Reporte' />
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
                    <PaginationTable quantity={reports.last_page} itemsTotal={reports.total} handleChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className='row mt-2'>
                <div className='d-flex'>
                  <table className='table TableP table-striped'>
                    <thead>
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

                            <button className='TableActionButtons'>
                              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
                                <path d='M15.3332 3C15.3332 2.44772 14.8855 2 14.3332 2H11.8158C11.3946 0.804906 10.267 0.0040625 8.99985 0H6.99985C5.73269 0.0040625 4.6051 0.804906 4.18385 2H1.6665C1.11422 2 0.666504 2.44772 0.666504 3C0.666504 3.55228 1.11422 4 1.6665 4H1.99985V12.3333C1.99985 14.3584 3.64147 16 5.6665 16H10.3332C12.3582 16 13.9998 14.3584 13.9998 12.3333V4H14.3332C14.8855 4 15.3332 3.55228 15.3332 3ZM11.9998 12.3333C11.9998 13.2538 11.2537 14 10.3332 14H5.6665C4.74604 14 3.99985 13.2538 3.99985 12.3333V4H11.9998V12.3333Z' fill='#495057' />
                                <path d='M6.33301 12C6.88529 12 7.33301 11.5523 7.33301 11V7C7.33301 6.44772 6.88529 6 6.33301 6C5.78073 6 5.33301 6.44772 5.33301 7V11C5.33301 11.5523 5.78073 12 6.33301 12Z' fill='#495057' />
                                <path d='M9.6665 12C10.2188 12 10.6665 11.5523 10.6665 11V7C10.6665 6.44772 10.2188 6 9.6665 6C9.11422 6 8.6665 6.44772 8.6665 7V11C8.6665 11.5523 9.11422 12 9.6665 12Z' fill='#495057' />
                              </svg>
                            </button>
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

export default Reports
