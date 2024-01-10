import { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getCountriesCount} from '../../helpers/banks'
import { getUsers } from '../../helpers/users'
import { updateStore } from '../../helpers/stores'
import Select from 'react-select'

const ModalEditStore = ({ modalShow, setModalShow, store }) => {
  const [countries, setCountries] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const [users, setUsers] = useState([])
  const [display, setDisplay] = useState('hidden')
  const [alertType, setAlertType] = useState('danger')
  const form = useRef()
  
  useEffect(() => {
    Promise.all([getCountriesCount(), getUsers(`paginated=no&role=3`)])
    .then(([countriesResponse, usersResponse]) => {
      setCountries(countriesResponse);
      setUsers(usersResponse.data.map(e => ({ label: `${e.name} - ${e.email}`, value: e.id })));
    })
    .catch(({error, message}) => {
      setErrorMessage(error.message);
      setAlertType("danger");
    });
  }, [])
  
  const handleStore = async () => {
    try {
      const formData = new FormData(form.current);
      const request = await updateStore(store.id, formData)

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
              <label htmlFor='name' className='form-label'>Nombre <span className='Required'>*</span></label>
              <input defaultValue={store.name} required className='form-control' type='text' name='name' id='name' />
            </div>
            <div className='col'>
              <label htmlFor='location'  className='form-label'>Dirección <span className='Required'>*</span></label>
              <input defaultValue={store.location} required className='form-control' type='text' name='location' id='location' />
            </div>
          </div>
          <div className='row'>
            <div className='col'>
              <label htmlFor='country_id'  className='form-label'>País <span className='Required'>*</span></label>
              <select required className='form-select' name='country_id' id='country_id'>
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
            <label htmlFor="user_id" className='form-label'>Manejador <span className='Required'>*</span></label>
              <Select
                inputId={"user_id"}ks
                name={"user_id"}
                placeholder="Seleccione un manejador"
                noOptionsMessage={()=> "No hay coincidencias"}
                options={users}
                defaultValue={
                  {
                    label: `${store.user.name} - ${store.user.email}`,
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
