import { useEffect, useState, useRef } from "react"
import { getInconsistences, updateReport } from "../helpers/reports"
import Welcome from "../components/Welcome";
import FilterTableButtons from "../components/FilterTableButtons";
import InconsistenceCard from "../components/InconsistenceCard";
import ModalViewReport from "../components/ModalViewReport";
import PaginationTable from "../components/PaginationTable";

const Inconsistences = () => {
  const form = useRef();
  const [modalShow, setModalShow] = useState(false);
  const [offset, setOffset] = useState(1);
  
  const [offsetE, setOffsetE] = useState(1);
  const [modalCreateShow, setModalCreateShow] = useState();
  const [reports, setReports] = useState();
  const [reportModal, setReportModal] = useState();
  useEffect(()=>{
    getInconsistences().then(r => setReports(r));
  },[]);
  const handleType = ()=>{
    getInconsistences(`${form.current.filter_type.value === 'yes'?'&reviewed=yes':''}`).then(r => setReports(r));
  }  
  const handleChange = (offset, type = 'income') => {
    setOffset(offset.selected + 1)
    getInconsistences(`page=${offset.selected+1}${form.current.filter_type.value === 'yes'?'&reviewed=yes':''}`).then(r=> setReports({...reports, [type]: r[type]}))
  }
  const handleModal = (e)=>{
    setModalShow(true);
    setReportModal(e);
  }
  const checkReportI = (e)=>{
    updateReport({
      inconsistence_check: true
    }, e);
    getInconsistences(`page=${offset}`).then(r=> setReports({...reports, income: r.income}));
  }
  const checkReportE = (e)=>{
    updateReport({
      inconsistence_check: true
    }, e);
    getInconsistences(`page=${offsetE}`).then(r=> setReports({...reports, expense: r.expense}));
  }
  return (
    <div className="container">
      <Welcome text='Reportes' add={() => setModalCreateShow(true)} textButton='Reporte' />
      <div className='row mt-4'>
        <form action='' ref={form} className='form-group row'>
          <div className='col-8'><FilterTableButtons data={[{name: 'Revisados', id: 'yes'}]} callback={handleType} /></div>
          <div className='col-4'></div>
        </form>
      </div>
      <div className="row mt-4">
        <div className="col-6">
          {
            reports?
            reports.income.data.map((e)=>{
              return <InconsistenceCard key={e.id} report={e} showModal={handleModal} checkReport={checkReportI}/>
            })
            :<div className='d-flex justify-content-center align-items-center'>No hay reportes para mostrar</div>
          }
          {
            reports
            ?<PaginationTable itemOffset={offset} quantity={reports.income.last_page} itemsTotal={reports.income.total} handleChange={(offset)=>handleChange(offset, 'income')} />
            :null
          }
        </div>
        <div className="col-6">
          {
            reports?
            reports.expense.data.map((e)=>{
              return <InconsistenceCard key={e.id} report={e} showModal={handleModal} checkReport={checkReportE}/>  
            })
            :<div className='d-flex justify-content-center align-items-center'>No hay reportes para mostrar</div>
          }
          {
            reports
            ?<PaginationTable itemOffset={offsetE} quantity={reports.expense.last_page} itemsTotal={reports.expense.total} handleChange={(offset)=>handleChange(offset, 'expense')} />
            :null
          }
        </div>
      </div>
      <ModalViewReport modalShow={modalShow} setModalShow={setModalShow} report={reportModal} />
    </div>
  )
}

export default Inconsistences