import React, { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getUsers } from '../../helpers/users'
import { getCountriesCount } from '../../helpers/banks'
import { createStore } from '../../helpers/stores'
import SearchSelect from '../SearchSelect'

const ModalCreateStore = ({ modalShow, setModalShow }) => {
  const [countries, setCountries] = useState()
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
        user_id: formData.user.value
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
  const handleSearch = async(e) => {
    try {
      const users = await getUsers(`search=${e}`);
      return users.data;
    } catch (error) {
      
    }
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
        <form className='container' action='' ref={form}>
          <div className='row mb-3'>
            <div className=' col '>
              <label htmlFor='name' className='form-label'>Nombre</label>
              <input required className='form-control' type='text' name='name' />
            </div>
            <div className='col'>
              <label htmlFor='location'  className='form-label'>Dirección</label>
              <input required className='form-control' type='text' name='location' />
            </div>
          </div>
          <div className='row'>
            <div className='col'>
              <label htmlFor='country_id'  className='form-label'>País</label>
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
            <div className='col '>
              <SearchSelect
                label={"Usuario"}
                nameSearch={"user"}
                handleSearch={handleSearch}
                description={['name', "email"]}
              />
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        {
          errorMessage
            ? <Alert variant={alertType} style={{ maxWidth: '100%', textAlign: 'center' }}>
              {errorMessage}
            </Alert>
            : null
        }
        <button onClick={handleStore} className='btn btn-primary'>Crear local</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalCreateStore
