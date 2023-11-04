import React, { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getCountriesCount} from '../../helpers/banks'
import { getUsers } from '../../helpers/users'
import { useUUID } from '../../hooks/useUUID'
import { updateStore } from '../../helpers/stores'
import SearchSelect from '../SearchSelect'

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
        name: form.current.name.value,
        location: form.current.location.value,
        country_id: form.current.country.value,
        user_id: form.current.user.value
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

  
  const handleSearch = async(e) => {
    try {
      const users = await getUsers(`search=${e}`);
      return users.data;
    } catch (error) {
      
    }
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
        <form className='container' action='' ref={form}>
          <div className='row mb-3'>
            <div className=' col '>
              <label htmlFor='name' className='form-label'>Nombre</label>
              <input defaultValue={store.name} required className='form-control' type='text' name='name' />
            </div>
            <div className='col'>
              <label htmlFor='location'  className='form-label'>Dirección</label>
              <input defaultValue={store.location} required className='form-control' type='text' name='location' />
            </div>
          </div>
          <div className='row'>
            <div className='col'>
              <label htmlFor='country_id'  className='form-label'>País</label>
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
            <div className='col '>
              <SearchSelect
                label={"Usuario"}
                nameSearch={"user"}
                handleSearch={handleSearch}
                description={['name', "email"]}
                defaultValue={
                  {
                    label: `${store.user.name} - ${store.user.email} -`,
                    value: store.user.id
                  }
                }
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
          <button onClick={handleStore} className='btn btn-primary'>Editar local</button>
        </Modal.Footer>
        </Modal>
      : null
  )
}

export default ModalEditStore
