import { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getUsersRoles, updateUser } from '../../helpers/users'
import { getCountriesCount } from '../../helpers/banks'

const ModalEditUser = ({ modalShow, setModalShow, user, setUser }) => {
  const [roles, setRoles] = useState();
  const allRoles = useRef([]);
  const [countries, setCountries] = useState()
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const [loading, setLoading] = useState(false);
  const form = useRef();

  useEffect(() => {
    setLoading(true);
    Promise.all([ getUsersRoles(), getCountriesCount(), ])
    .then(([rolesResponse, countriesResponse]) => {
      allRoles.current = rolesResponse;
      let roles = [];
      if (user.country_id == 2) {
        roles = rolesResponse.filter(({id}) => id == 1 || id == 2);
      } else {
        roles = rolesResponse.filter(({id}) => id !== 2);
      }
      setCountries(countriesResponse);
      setRoles(roles);
    })
    .catch((error) => {
      console.log(error);
      setAlertType("danger");
      setErrorMessage(error.response.data.error);
    })
    .finally(setLoading(false));
  }, [])

  const handleUser = async () => {
    setLoading(true);
    try {
      const formData = new FormData(form.current)
      let userUpdate;
      if (form.current.password.value === '') {
        userUpdate = {
          name: user.name,
          email: user.email,
          country_id: form.current.country.value,
          role_id: form.current.role.value
        }
      }
      else{
        userUpdate = {
          name: user.name,
          email: user.email,
          password: form.current.password.value,
          password_confirmation: form.current.password_confirmation.value,
          country_id: form.current.country.value,
          role_id: form.current.role.value
        }
      }
      const request = await updateUser(user.id, userUpdate)

      switch (request.status) {
        case 201:
          setErrorMessage('Usuario actualizado con éxito')
          setAlertType('success')

          window.location.reload()
          break
        case 422:
          setErrorMessage(request.data.message)
          setAlertType('danger')
          break

        default:
          setErrorMessage('Error actualizando el usuario')
          setAlertType('danger')
          break
      }
    } catch (error) {
      setErrorMessage('Error actualizando el usuario')
      setAlertType('danger')
    }
    setLoading(false);
  }

  const handleCountryChange = ({target}) => {
    let roles = [];

    if (target.value == 2) {
      roles = allRoles.current.filter(({id}) => id == 1 || id == 2);
    } else {
      roles = allRoles.current.filter(({id}) => id !== 2);
    }
    setRoles(roles);
    setUser((prev) => ({ ...prev, country_id: target.value, role_id: 1 }));
  }

  return (
    user
      ? <Modal show={modalShow} size='lg' onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className='container'>
              <div className='row'>
                <div className='d-flex flex-column'>
                  <span className='ModalTopTitle'>Editar usuario</span>
                  <span className='ModalTopSubTitle'>Esta pestaña le permite editar un usuario existente</span>
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
                      <input required onChange={(e) => setUser({ ...user, name: e.target.value })} className='form-control' type='text' id='name' name='name' value={user.name} />
                    </div>
                    <div>
                      <label htmlFor='email'>Email <span className='Required'>*</span></label>
                      <input readOnly onChange={(e) => setUser({ ...user, email: e.target.value })} className='form-control' type='email' id='email' name='email' value={user.email} />
                    </div>
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='password'>Contraseña </label>
                    <input required id='password' name='password' onChange={(e) => setUser({ ...user, password: e.target.value })} className='form-control' type='password' />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='confirm-password'>Confirmar Contraseña</label>
                    <input required id='confirm-password' name='password_confirmation' onChange={(e) => setUser({ ...user, password_confirmation: e.target.value })} className='form-control' type='password' />
                  </div>
                  <div className='d-flex mb-3'>
                    <div className='me-4'>
                      <label htmlFor='role'>Rol <span className='Required'>*</span></label>
                      <select required className='form-select' value={user.role_id} onChange={({target}) => setUser((prev) => ({...prev, role_id: target.value}))} name='role' id='role'>
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
                      <select required className='form-select' name='country' id='country' value={user.country_id} onChange={handleCountryChange}>
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
          <button onClick={handleUser} className='btn btn-primary' disabled={loading}>Editar Usuario</button>
        </Modal.Footer>
        </Modal>
      : null
  )
}

export default ModalEditUser
