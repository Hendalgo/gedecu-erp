import React, { useContext, useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { SessionContext } from '../context/SessionContext'
import FilterTableButtons from '../components/FilterTableButtons'
import SearchBar from '../components/SearchBar'
import PaginationTable from '../components/PaginationTable'
import ModalViewReport from '../components/ModalViewReport'
import { getBanks, getCountriesCount } from '../helpers/banks'
import Welcome from '../components/Welcome'
import ModalCreateBank from '../components/ModalCreateBank'
import ModalEditBank from '../components/ModalEditBank'

const Banks = () => {
  const {session} = useContext(SessionContext);
  const [countryBank, setCountryBank] = useState([]);
  const [bank, setEditBank] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [modalEditShow, setModalEditShow] = useState(false);
  const [banks, setBanks] = useState([]);
  const form= useRef();

  useEffect(()=>{
    getCountriesCount().then(r => setCountryBank(r));
    getBanks("order=created_at&order_by=desc").then(r=> setBanks(r));
  }, [])
  const handleChange = (offset)=>{
    getBanks(`order=created_at&order_by=desc&page=${offset.selected+1}&search=${form.current.search.value}`).then(r=> setBanks(r));
  }
  const handleModal = (id)=>{
    setEditBank( bank.data.find( (el)=> el.id === id));
    setModalShow(true);
  }
  const handleType = (e) => {
    getBanks(`order=created_at&order_by=desc&country=${e}&search=${form.current.search.value}`).then(r => setBanks(r));
  }
  const handleSearch = (e)=>{
    e.preventDefault();
    if (form.current.search !== '') {
      getBanks(`order=created_at&order_by=desc&search=${form.current.search.value}`).then(r=> setBanks(r));
    }
  }
  const handleBank = (e)=>{
    setModalEditShow(true);
    setEditBank(e);
  }
  return(
    <div className="container-fluid">
      <Welcome text='Bancos'  add={()=> setModalShow(true)}/>
      <div className="row mt-4">
        <form onSubmit={handleSearch} action="" ref={form} className="form-group row">
          <div className="col-8"><FilterTableButtons data={countryBank} callback={handleType}/></div>
          <div className="col-4"><SearchBar text="Bancos" /></div>
        </form>
      </div>
      {
        Array.isArray(banks.data)
        ?
        banks.data.length > 0

        ?<>
        <div className="row mt-4">
          <div className="col-12">
            <div className="d-flex justify-content-between">
              <div>
              </div>
              <PaginationTable text='bancos' quantity={banks.last_page} itemsTotal={banks.total} handleChange={handleChange} />
            </div>
          </div>
        </div>
        <div className="row mt-2">
          <div className="d-flex">
            <table className='table TableP table-striped' >
              <thead>
                <tr className='pt-4'>
                  <th scope='col'>ID Banco</th>
                  <th scope='col'>Nombre</th>
                  <th scope='col'>País</th>
                  <th scope='col'>Monto</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  banks.data.map(e=>
                    {
                      return(<tr key={e.id}>
                              <td scope='row'>
                                <div className="d-flex justify-content-between align-items-center">
                                  <span>{e.id}</span>
                                </div>
                              </td>
                              <td>{e.name}</td>
                              <td>{e.country.name}</td>
                              <td>{e.country.currency.symbol} {e.amount.toLocaleString('de-DE',{minimumFractionDigits: 2})}</td>
                              <td>
                                <div className="d-flex justify-content-evenly align-items-center">
                                  <button onClick={()=> handleBank(e)} className='TableActionButtons'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                      <g clipPath="url(#clip0_156_194122)">
                                        <path d="M15.216 0.783999C14.7065 0.2971 14.0288 0.0253906 13.324 0.0253906C12.6192 0.0253906 11.9416 0.2971 11.432 0.783999L1.07401 11.142C0.732617 11.4815 0.46192 11.8853 0.277573 12.3301C0.0932258 12.7749 -0.00111372 13.2519 9.9204e-06 13.7333V15C9.9204e-06 15.2652 0.105367 15.5196 0.292903 15.7071C0.48044 15.8946 0.734793 16 1.00001 16H2.26668C2.74838 16.0013 3.22556 15.907 3.67059 15.7227C4.11562 15.5383 4.51967 15.2676 4.85934 14.926L15.216 4.568C15.7171 4.06582 15.9985 3.3854 15.9985 2.676C15.9985 1.9666 15.7171 1.28617 15.216 0.783999ZM3.44401 13.512C3.13093 13.823 2.708 13.9984 2.26668 14H2.00001V13.7333C2.00138 13.2916 2.1767 12.8681 2.48801 12.5547L10.2 4.84467L11.1553 5.8L3.44401 13.512ZM13.8 3.154L12.5693 4.38667L11.6133 3.43067L12.8467 2.2C12.9753 2.07705 13.1464 2.00844 13.3243 2.00844C13.5023 2.00844 13.6734 2.07705 13.802 2.2C13.9277 2.32704 13.9981 2.49867 13.9977 2.67741C13.9974 2.85615 13.9263 3.02749 13.8 3.154Z" fill="#495057"/>
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_156_194122">
                                        <rect width="16" height="16" fill="white"/>
                                        </clipPath>
                                      </defs>
                                    </svg>
                                  </button>
                                  <button className='TableActionButtons'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                      <path d="M15.3332 3C15.3332 2.44772 14.8855 2 14.3332 2H11.8158C11.3946 0.804906 10.267 0.0040625 8.99985 0H6.99985C5.73269 0.0040625 4.6051 0.804906 4.18385 2H1.6665C1.11422 2 0.666504 2.44772 0.666504 3C0.666504 3.55228 1.11422 4 1.6665 4H1.99985V12.3333C1.99985 14.3584 3.64147 16 5.6665 16H10.3332C12.3582 16 13.9998 14.3584 13.9998 12.3333V4H14.3332C14.8855 4 15.3332 3.55228 15.3332 3ZM11.9998 12.3333C11.9998 13.2538 11.2537 14 10.3332 14H5.6665C4.74604 14 3.99985 13.2538 3.99985 12.3333V4H11.9998V12.3333Z" fill="#495057"/>
                                      <path d="M6.33301 12C6.88529 12 7.33301 11.5523 7.33301 11V7C7.33301 6.44772 6.88529 6 6.33301 6C5.78073 6 5.33301 6.44772 5.33301 7V11C5.33301 11.5523 5.78073 12 6.33301 12Z" fill="#495057"/>
                                      <path d="M9.6665 12C10.2188 12 10.6665 11.5523 10.6665 11V7C10.6665 6.44772 10.2188 6 9.6665 6C9.11422 6 8.6665 6.44772 8.6665 7V11C8.6665 11.5523 9.11422 12 9.6665 12Z" fill="#495057"/>
                                      </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>)  
                    }
                  )
                }
                </tbody>
              </table>
            </div>
          </div>
          </>
          :null
          :null
        }
      <div className="">
        <ModalCreateBank setModalShow={setModalShow} modalShow={modalShow} />
        <ModalEditBank setModalShow={setModalEditShow} modalShow={modalEditShow} bank={bank} setBank={setEditBank}/>
      </div>
    </div>
  )
}

export default Banks