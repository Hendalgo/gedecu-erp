import React, { useRef, useState, useEffect, useContext } from 'react'
import Welcome from '../components/Welcome'
import FilterTableButtons from '../components/FilterTableButtons'
import SearchBar from '../components/SearchBar'
import PaginationTable from '../components/PaginationTable'
import { getUsers, getUsersRoles } from '../helpers/users'
import ModalCreateUser from '../components/ModalCreateUser'
import ModalEditUser from '../components/ModalEditUser'
import TableLoader from '../components/Loaders/TableLoader'
import { Navigate } from 'react-router-dom'
import { useCheckRole } from '../hooks/useCheckRole'
import { SessionContext } from '../context/SessionContext'

const Users = () => {

  const { session } = useContext(SessionContext)
  const [editUser, setEditUser] = useState({})
  const [userRoles, setUserRoles] = useState()
  const [modalShow, setModalShow] = useState(false)
  const [modalEditShow, setModalEditShow] = useState(false)
  const [users, setUsers] = useState([])
  const form = useRef()

  if (!useCheckRole(session)) {
    return <Navigate to={"/"}/>
  }
  useEffect(() => {
    getUsersRoles('order=created_at&order_by=desc').then(r => setUserRoles(r))
    getUsers().then(r => setUsers(r))
  }, [])
  const handleType = (e) => {
    getUsers(`order=created_at&order_by=desc${e ? `&role=${e}` : ''}&search=${form.current.search.value}`).then(r => setUsers(r))
  }
  const handleSearch = (e) => {
    e.preventDefault()
    if (form.current.search !== '') {
      getUsers(`order=created_at&order_by=desc${form.current.filter_type.value !== 'false' ? `&role=${form.current.filter_type.value}` : ''}&search=${form.current.search.value}`).then(r => setUsers(r))
    }
  }
  const handleChange = (offset) => {
    getUsers(`order=created_at&order_by=desc&page=${offset.selected + 1}${form.current.filter_type.value !== 'false' ? `&role=${form.current.filter_type.value}` : ''}&search=${form.current.search.value}`).then(r => setUsers(r))
  }
  const handleUser = (user) => {
    setModalEditShow(true)
    setEditUser(user)
  }
  return (
    <div className='container-fluid'>
      <Welcome text='Usuarios' add={() => setModalShow(true)} textButton='Usuario' />
      <div className='row mt-4'>
        <form onSubmit={handleSearch} action='' ref={form} className='form-group row'>
          <div className='col-8'><FilterTableButtons data={userRoles} callback={handleType} /></div>
          <div className='col-4'><SearchBar text='Usuario' /></div>
        </form>
      </div>
      {
        Array.isArray(users.data)
          ? users.data.length > 0

            ? <>
              <div className='row mt-4'>
                <div className='col-12'>
                  <div className='d-flex justify-content-between'>
                    <div />
                    <PaginationTable text='bancos' quantity={users.last_page} itemsTotal={users.total} handleChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className='row mt-2'>
                <div className='d-flex'>
                  <table className='table TableP table-striped'>
                    <thead>
                      <tr className='pt-4'>
                        <th scope='col'>Email</th>
                        <th scope='col'>Nombre</th>
                        <th scope='col'>País</th>
                        <th scope='col'>Rol</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {
                  users.data.map(e => {
                    return (
                      <tr key={e.id}>
                        <td scope='row'>
                          <div className='d-flex justify-content-between align-items-center'>
                            <span>{e.email}</span>
                          </div>
                        </td>
                        <td>{e.name}</td>
                        <td>{e.country.name}</td>
                        <td style={{ textTransform: 'capitalize' }}>{e.role.name}</td>
                        <td>
                          <div className='d-flex justify-content-evenly align-items-center'>
                            <button onClick={() => handleUser(e)} className='TableActionButtons'>
                              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
                                <g clipPath='url(#clip0_156_194122)'>
                                  <path d='M15.216 0.783999C14.7065 0.2971 14.0288 0.0253906 13.324 0.0253906C12.6192 0.0253906 11.9416 0.2971 11.432 0.783999L1.07401 11.142C0.732617 11.4815 0.46192 11.8853 0.277573 12.3301C0.0932258 12.7749 -0.00111372 13.2519 9.9204e-06 13.7333V15C9.9204e-06 15.2652 0.105367 15.5196 0.292903 15.7071C0.48044 15.8946 0.734793 16 1.00001 16H2.26668C2.74838 16.0013 3.22556 15.907 3.67059 15.7227C4.11562 15.5383 4.51967 15.2676 4.85934 14.926L15.216 4.568C15.7171 4.06582 15.9985 3.3854 15.9985 2.676C15.9985 1.9666 15.7171 1.28617 15.216 0.783999ZM3.44401 13.512C3.13093 13.823 2.708 13.9984 2.26668 14H2.00001V13.7333C2.00138 13.2916 2.1767 12.8681 2.48801 12.5547L10.2 4.84467L11.1553 5.8L3.44401 13.512ZM13.8 3.154L12.5693 4.38667L11.6133 3.43067L12.8467 2.2C12.9753 2.07705 13.1464 2.00844 13.3243 2.00844C13.5023 2.00844 13.6734 2.07705 13.802 2.2C13.9277 2.32704 13.9981 2.49867 13.9977 2.67741C13.9974 2.85615 13.9263 3.02749 13.8 3.154Z' fill='#495057' />
                                </g>
                                <defs>
                                  <clipPath id='clip0_156_194122'>
                                    <rect width='16' height='16' fill='white' />
                                  </clipPath>
                                </defs>
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
            : <div className='d-flex justify-content-center align-items-center'>No hay usuarios para mostrar</div>
          : <div className='mt-4'><TableLoader /></div>
        }
      <div className=''>
        <ModalCreateUser modalShow={modalShow} setModalShow={setModalShow} />
        <ModalEditUser modalShow={modalEditShow} setModalShow={setModalEditShow} setUser={setEditUser} user={editUser} />
      </div>
    </div>
  )
}

export default Users
