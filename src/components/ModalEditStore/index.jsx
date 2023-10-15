import React, { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getCountriesCount} from '../../helpers/banks'
import { getUsers } from '../../helpers/users'
import { useUUID } from '../../hooks/useUUID'
import { updateStore } from '../../helpers/stores'

const ModalEditStore = ({ modalShow, setModalShow, store, setStore }) => {
  const [countries, setCountries] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const [users, setUsers] = useState([])
  const [display, setDisplay] = useState('hidden')
  const [alertType, setAlertType] = useState('danger')
  const form = useRef()
  useEffect(() => {
    getCountriesCount().then(r => setCountries(r))
  }, [])
  const handleStore = async () => {
    try {
      const request = await updateStore(store.id, {
        name: store.name,
        location: store.location,
        country_id: form.current.country.value,
        user_id: form.current.search.id
      })

      switch (request.status) {
        case 201:
          setErrorMessage('Local actualizado con éxito')
          setAlertType('success')

          window.location.reload()
          break
        case 422:
          setErrorMessage(request.data.message)
          setAlertType('danger')
          break

        default:
          setErrorMessage('Error actualizando el local')
          setAlertType('danger')
          break
      }
    } catch (error) {
      console.log(error)
      setErrorMessage('Error actualizando el local')
      setAlertType('danger')
    }
  }

  const handleSearch = (e) => {
    getUsers(`search=${e.target.value}`).then(r => setUsers(r.data))
  }
  const handleSelect = (e) => {
    form.current.search.id = e.id
    form.current.search.value = e.name
    setDisplay('hidden')
  }
  return (
    store
      ? <Modal show={modalShow} size='lg' onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className='container'>
              <div className='row'>
                <div className='d-flex flex-column'>
                  <span className='ModalTopTitle'>Editar local</span>
                  <span className='ModalTopSubTitle'>Esta pestaña le permite editar un local existente</span>
                </div>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='container'>
            <div className='row'>
              <div className='d-flex'>
                <form className='FormContainer' action='' ref={form}>
                  <div className='d-flex mb-3'>
                    <div className='me-4'>
                      <label htmlFor='name'>Nombre</label>
                      <input required className='form-control' type='text' name='name' value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor='location'>Dirección</label>
                      <input required className='form-control' type='text' name='location' value={store.location} onChange={(e) => setStore({ ...store, location: e.target.value })} />
                    </div>
                  </div>
                  <div className='d-flex mb-3'>
                    <div>
                      <label htmlFor='country_id'>País</label>
                      <select required className='form-select' name='country' id=''>
                        {
                    countries
                      ? countries.map(e => {
                        return <option key={e.id} defaultValue={e.id === store.country.id} style={{ textTransform: 'capitalize' }} value={e.id}>{e.name}</option>
                      })
                      : null
                  }
                      </select>
                    </div>
                    <div className='ms-3'>
                      <search role='search'>
                        <label htmlFor='country_id'>Usuario</label>
                        <input autoComplete='off' id={store.user.id} onChange={handleSearch} defaultValue={store.user.name} onBlur={() => setTimeout(() => setDisplay('hidden'), 100)} onFocus={() => setDisplay('visible')} className='form-control' type='search' name='search' />
                        <fieldset className='UserSearch' style={{ visibility: display }}>
                          {
                    Array.isArray(users)
                      ? users.map((e) => {
                        const uuid = useUUID()
                        return (
                          <div key={e.id}>
                            <label htmlFor={uuid}>
                              <span className='SearchResultName'>
                                {e.name}
                              </span>
                              <span className='SearchResultDescription'>
                                {e.email}
                              </span>
                            </label>
                            <input onClick={() => handleSelect(e)} type='radio' name='user_id' value={e.id} id={uuid} />
                          </div>
                        )
                      })
                      : null
                  }
                        </fieldset>
                      </search>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {
        errorMessage
          ? <Alert variant={alertType} style={{ maxWidth: '100%', textAlign: 'center' }}>
            {errorMessage}
          </Alert>
          : null
      }
          <button onClick={handleStore} className='btn btn-primary'>Editar local</button>
        </Modal.Footer>
        </Modal>
      : null
  )
}

export default ModalEditStore
