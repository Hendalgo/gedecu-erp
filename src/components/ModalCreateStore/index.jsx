import React, { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getUsers } from '../../helpers/users'
import { getCountriesCount } from '../../helpers/banks'
import { createStore } from '../../helpers/stores'

const ModalCreateStore = ({ modalShow, setModalShow }) => {
  const [countries, setCountries] = useState()
  const [users, setUsers] = useState([])
  const [display, setDisplay] = useState('hidden')
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const form = useRef()
  useEffect(() => {
    getCountriesCount().then(r => setCountries(r))
  }, [])
  const handleStore = async () => {
    try {
      const formData = form.current
      const request = await createStore({
        name: formData.name.value,
        location: formData.location.value,
        country_id: formData.country_id.value,
        user_id: formData.search.id
      })

      switch (request.status) {
        case 201:
          setErrorMessage('Local creado con éxito')
          setAlertType('success')

          window.location.reload()
          break
        case 422:
          setErrorMessage(request.data.message)
          setAlertType('danger')
          break

        default:
          setErrorMessage('Error en la creación del local')
          setAlertType('danger')
          break
      }
    } catch (error) {
      setErrorMessage('Error en la creación del Local')
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
    <Modal show={modalShow} size='lg' onHide={() => setModalShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className='container'>
            <div className='row'>
              <div className='d-flex flex-column'>
                <span className='ModalTopTitle'>Crear Nuevo Local</span>
                <span className='ModalTopSubTitle'>Esta pestaña le permite crear un nuevo Local</span>
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
                    <input required className='form-control' type='text' name='name' />
                  </div>
                  <div>
                    <label htmlFor='location'>Dirección</label>
                    <input required className='form-control' type='text' name='location' />
                  </div>
                </div>
                <div className='d-flex mb-3'>
                  <div>
                    <label htmlFor='country_id'>País</label>
                    <select required className='form-select' name='country_id' id=''>
                      {
                    countries
                      ? countries.map(e => {
                        return <option key={e.id} style={{ textTransform: 'capitalize' }} value={e.id}>{e.name}</option>
                      })
                      : null
                  }
                    </select>
                  </div>
                  <div className='ms-3'>
                    <search role='search'>
                      <label htmlFor='country_id'>Usuario</label>
                      <input autoComplete='off' onChange={handleSearch} onBlur={() => setTimeout(() => setDisplay('hidden'), 100)} onFocus={() => setDisplay('visible')} className='form-control' type='search' name='search' />
                      <fieldset className='UserSearch' style={{ visibility: display }}>
                        {
                    Array.isArray(users)
                      ? users.map((e) => {
                        return (
                          <div key={e.id}>
                            <label htmlFor={e.id}>
                              <span className='SearchResultName'>
                                {e.name}
                              </span>
                              <span className='SearchResultDescription'>
                                {e.email}
                              </span>
                            </label>
                            <input onClick={() => handleSelect(e)} type='radio' name='user_id' value={e.id} id={e.id} />
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
        <button onClick={handleStore} className='btn btn-primary'>Crear banco</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalCreateStore
