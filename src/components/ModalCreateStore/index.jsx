import { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getUsers } from '../../helpers/users'
import { getCountriesCount } from '../../helpers/banks'
import { createStore } from '../../helpers/stores'
import Select from 'react-select'

const ModalCreateStore = ({ modalShow, setModalShow }) => {
  const [countries, setCountries] = useState();
  const [users, setUsers] = useState();
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
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
      const request = await createStore(formData);

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
        <form className='container' action='' ref={form} autoComplete='off'>
          <div className='row mb-3'>
            <div className=' col '>
              <label htmlFor='name' className='form-label'>Nombre <span className='Required'>*</span></label>
              <input required className='form-control' type='text' name='name' id='name' />
            </div>
            <div className='col'>
              <label htmlFor='location'  className='form-label'>Dirección <span className='Required'>*</span></label>
              <input required className='form-control' type='text' name='location' id='location' />
            </div>
          </div>
          <div className='row'>
            <div className='col-6'>
              <label htmlFor='country_id'  className='form-label'>País <span className='Required'>*</span></label>
              <select required className='form-select' name='country_id' id='country_id'>
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
              <label htmlFor="user_id" className='form-label'>Manejador <span className='Required'>*</span></label>
              <Select
                placeholder="Seleccione un manejador"
                noOptionsMessage={()=> "No hay coincidencias"}
                inputId='user_id'
                name='user_id'
                options={users}
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
