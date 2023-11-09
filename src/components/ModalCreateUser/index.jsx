import React, { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { createUser, getUsersRoles } from '../../helpers/users'
import { getCountriesCount } from '../../helpers/banks'

const ModalCreateUser = ({ modalShow, setModalShow }) => {
  const [roles, setRoles] = useState()
  const [countries, setCountries] = useState()
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const form = useRef()
  useEffect(() => {
    getUsersRoles().then(r => setRoles(r))
    getCountriesCount().then(r => setCountries(r))
  }, [])
  const handleUser = async () => {
    try {
      const formData = new FormData(form.current)
      const request = await createUser(formData)

      switch (request.status) {
        case 201:
          setErrorMessage('Usuario creado con éxito')
          setAlertType('success')

          window.location.reload()
          break
        case 422:
          setErrorMessage(request.data.message)
          setAlertType('danger')
          break

        default:
          setErrorMessage('Error en la creación del usuario')
          setAlertType('danger')
          break
      }
    } catch (error) {
      setErrorMessage('Error en la creación del usuario')
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
                <span className='ModalTopTitle'>Crear Nuevo usuario</span>
                <span className='ModalTopSubTitle'>Esta pestaña le permite crear un nuevo usuario y asignarle un rol</span>
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
                    <label htmlFor='name'>Nombre <span className='Required'>*</span></label>
                    <input required className='form-control' type='text' name='name' />
                  </div>
                  <div>
                    <label htmlFor='email'>Email <span className='Required'>*</span></label>
                    <input required className='form-control' type='email' name='email' />
                  </div>
                </div>
                <div className='mb-3'>
                  <label htmlFor='password'>Contraseña <span className='Required'>*</span></label>
                  <input required name='password' className='form-control' type='password' />
                </div>
                <div className='mb-3'>
                  <label htmlFor='confirm-password'>Confirmar Contraseña <span className='Required'>*</span></label>
                  <input required name='password_confirmation' className='form-control' type='password' />
                </div>
                <div className='d-flex mb-3'>
                  <div className='me-4'>
                    <label htmlFor='role'>Rol <span className='Required'>*</span></label>
                    <select required className='form-select' name='role' >
                      {
                    roles
                      ? roles.map((e) => {
                        return <option key={e.id} style={{ textTransform: 'capitalize' }} value={e.id}>{e.name}</option>
                      })
                      : null
                  }
                    </select>
                  </div>
                  <div>
                    <label htmlFor='country'>País <span className='Required'>*</span></label>
                    <select required className='form-select' name='country' >
                      {
                    countries
                      ? countries.map(e => {
                        return <option key={e.id} style={{ textTransform: 'capitalize' }} value={e.id}>{e.name}</option>
                      })
                      : null
                  }
                    </select>
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
        <button onClick={handleUser} className='btn btn-primary'>Crear Usuario</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalCreateUser
