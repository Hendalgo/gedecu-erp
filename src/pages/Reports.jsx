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
  const formDate = useRef()
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
  const handleModal = (report) => {
    setReport(report)
    setModalShow(true)
  }
  const handleType = (e) => {
    
    const date = formDate.current.date.value? `&date=${formDate.current.date.value}`:'';
    getReports(`order=created_at${date}&order_by=desc${e ? `&type_id=${e}` : ''}&search=${form.current.search.value}`).then(r => setReports(r))
  }
  const handleSearch = (e) => {
    e.preventDefault()
    if (form.current.search !== '') {
      
       const date = formDate.current.date.value? `&date=${formDate.current.date.value}`:'';
      getReports(`order=created_at&order_by=desc${form.current.filter_type.value !== 'false' ? `&type_id=${form.current.filter_type.value}` : ''}&search=${form.current.search.value}${date}`).then(r => setReports(r))
    }
  }
  const handleDate = (e)=>{
    e.preventDefault();
    if (formDate.current.date.value) {
      getReports(`date=${formDate.current.date.value}&search=${form.current.search.value}${form.current.filter_type.value !== 'false' ? `&type_id=${form.current.filter_type.value}` : ''}`).then(r => setReports(r)).catch(e=> console.error(e));
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
        
        <div className="row mt-3">
          <div className="col-3">
            <form ref={formDate} onSubmit={(e)=>handleDate(e)}className="d-flex" method="post">
              <input style={{borderRadius: "0.25rem 0 0 0.25rem"}} type="date" name="date" className="form-control form-control-sm" id="" />
              <input  style={{borderRadius: "0 0.25rem 0.25rem 0"}} type="submit" className="btn btn-secondary" value="Filtrar"/>
            </form>
          </div>
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
                              <button className='btn' onClick={() => handleModal(e)}>
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
