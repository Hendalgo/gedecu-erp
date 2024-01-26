import { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../context/SessionContext'
import FilterTableButtons from '../components/FilterTableButtons'
import SearchBar from '../components/SearchBar'
import PaginationTable from '../components/PaginationTable'
import { useNavigate } from 'react-router-dom'
import { getDuplicates, } from '../helpers/reports'
import Welcome from '../components/Welcome'
import TableLoader from '../components/Loaders/TableLoader'
import AlertMessage from '../components/AlertMessage'
import { DASHBOARD_ROUTE, REPORTS_DUPLICATE_ROUTE, REPORTS_ROUTE } from '../consts/Routes'
import { formatAmount } from '../utils/amount'

const DuplicateReports = () => {
  const { session } = useContext(SessionContext)
  const [offset, setOffset] = useState(1);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState({message: "", variant: "danger"});
  
  const reportsTypes = [
    { id: 'yes', name: 'Verificados' },
    { id: 'no', name: 'Sin verificar' }
  ]
  const [reportType, setReportType] = useState(false);
  const [date, setDate] = useState("");

  const [duplicates, setDuplicates] = useState(null);
  const navigate = useNavigate();

  const fetchDuplicates = async (query = "") => {
    try {
      return await getDuplicates(`order=created_at&order_by=desc${query}`);
    } catch ({response}) {
      let errorMessage = "";
      const {error} = response.data;
      if (error) errorMessage = error;
      setAlert({message: errorMessage, variant: "danger"});
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setDuplicates(await fetchDuplicates());
    }

    fetchData();
  }, []);

  const handleChange = async (offset) => {
    const newOffset = offset.selected;
    setOffset(newOffset);

    let params = `&page=${newOffset}`;

    if (date) params += `&date=${date}&timeZoneOffset=${new Date().getTimezoneOffset()}`;
    if (search) params += `&search=${search}`;
    if (reportType) params += `&completed=${reportType}`;

    setDuplicates(await fetchDuplicates(params));
  }

  const handleType = async (e) => {
    setOffset(1);
    setReportType(e);

    let params = `${e ? `&completed=${e}` : ""}`;

    if (date) params += `&date=${date}&timeZoneOffset=${new Date().getTimezoneOffset()}`;
    if (search) params += `&search=${search}`;

    setDuplicates(await fetchDuplicates(params));
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    setOffset(1);

    let params = `${search ? `&search=${search}` : ""}`;

    if (date) params += `&date=${date}&timeZoneOffset=${new Date().getTimezoneOffset()}`;
    if (reportType) params += `&completed=${reportType}`;

    setDuplicates(await fetchDuplicates(params));
  }

  const handleDate = async (e) => {
    e.preventDefault();
    setOffset(1);

    let params = `${date ? `&date=${date}&timeZoneOffset=${new Date().getTimezoneOffset()}` : ""}`;

    if (search) params += `&search=${search}`;
    if (reportType) params += `&completed=${reportType}`;

    setDuplicates(await fetchDuplicates(params));
  }

  return (
    <>
      <div className='container-fluid'>
        <Welcome text='Reportes duplicados' showButton={false} />
        <div className='row mt-4'>
          <form onSubmit={handleSearch} action='' className='form-group row'>
            <div className='col-8'><FilterTableButtons data={reportsTypes} callback={handleType} /></div>
            <div className='col-4'><SearchBar text='Duplicados' change={setSearch} /></div>
          </form>
        </div>

        <div className='row mt-3'>
          <div className='col-3'>
            <form onSubmit={(e) => handleDate(e)} className='d-flex' method='post'>
              <input style={{ borderRadius: '0.25rem 0 0 0.25rem' }} type='date' name='date' onChange={({ target }) => setDate(target.value)} className='form-control form-control-sm' id='' />
              <input style={{ borderRadius: '0 0.25rem 0.25rem 0' }} type='submit' className='btn btn-secondary' value='Filtrar' />
            </form>
          </div>
        </div>

        {
          Array.isArray(duplicates?.data) ? duplicates.data.length > 0 ?
          <>
            <div className='row mt-4'>
              <div className='col-12'>
                <div className='d-flex justify-content-end'>
                  <PaginationTable offset={offset} itemOffset={offset} quantity={duplicates.last_page} itemsTotal={duplicates.total} handleChange={handleChange} />
                </div>
              </div>
            </div>

            <div className='row mt-2'>
              <div className='table-responsive'>
                <table className='table TableP table-borderless align-middle'>
                  <thead className=''>
                    <tr className='pt-4'>
                      <th scope='col'>Realizado por:</th>
                      <th scope='col'>Fecha - Hora</th>
                      <th scope='col'>Motivo</th>
                      <th scope='col'>Monto</th>
                      { session.role_id === 1 && <th /> }
                    </tr>
                  </thead>
                  <tbody>
                    {
                      duplicates.data.map(({id, report, created_at, currency, amount, duplicate_status}) => {
                        const reportTypeStyle = JSON.parse(report.type.config);
                        return <tr key={id}>
                          <td>{report.user.name} ({report.user.email})</td>
                          <td>{new Date(created_at).toLocaleString("es-VE", {hour12: true, year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric"})}</td>
                          <td><span style={{...reportTypeStyle.styles}} className='p-1 rounded'>{report.type.name}</span></td>
                          <td>{formatAmount(amount, currency.shortcode)}</td>
                          { session.role_id === 1 && <td>
                            <button className='btn bton-light border' onClick={() => navigate(`/${DASHBOARD_ROUTE}/${REPORTS_ROUTE}/${REPORTS_DUPLICATE_ROUTE}/${id}`)}>{duplicate_status ? "Ver" : "Verificar"}</button>
                          </td> }
                        </tr>
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </> :
          <div className='d-flex justify-content-center align-items-center'>No hay reportes duplicados para mostrar</div> :
          <div className='mt-4'><TableLoader /></div>
        }
      </div>
      <AlertMessage show={alert.message} setShow={() => setAlert({message: "", variant: "danger"})} message={alert.message} variant={alert.variant} />
    </>
  )
}

export default DuplicateReports
