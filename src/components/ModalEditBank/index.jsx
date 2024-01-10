import { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getCountriesCount, updateBank } from '../../helpers/banks'
import Select from 'react-select'

const ModalEditBank = ({ modalShow, setModalShow, bank, setBank }) => {
  const [countries, setCountries] = useState()
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const [accountTypes, setAccountTypes] = useState([]);
  const form = useRef()

  useEffect(() => {
    Promise.all([ getCountriesCount() ])
    .then(([countries]) => {
      setCountries(countries)
      // Tipos de cuentas
    }).catch(({error, message}) => {
      setErrorMessage(error.message);
      setAlertType("danger");
    })
  }, [])

  const handleUser = async () => {
    try {
      const data = new FormData(form.current);
      const request = await updateBank(bank.id, data)
      switch (request.status) {
        case 201:
          setErrorMessage('Banco actualizado con éxito')
          setAlertType('success')

          window.location.reload()
          break
        case 422:
          setErrorMessage(request.data.message)
          setAlertType('danger')
          break

        default:
          setErrorMessage('Error actualizando el banco')
          setAlertType('danger')
          break
      }
    } catch (error) {
      setErrorMessage('Error actualizando el banco')
      setAlertType('danger')
    }
  }
  return (
    bank
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
            <form className='FormContainer' action='' ref={form}>
              <div className='container'>
                <div className="row">
                  <div className='col'>
                    <label htmlFor='name'>Nombre <span className='Required'>*</span></label>
                    <input required onChange={(e) => setBank({ ...bank, name: e.target.value })} className='form-control' type='text' id='name' name='name' value={bank.name} />
                  </div>
                  <div className='col'>
                    <label htmlFor='country'>País <span className='Required'>*</span></label>
                    <select required className='form-select' name='country' id='country'>
                      {
                        countries
                          ? countries.map(e => {
                            return <option key={e.id} selected={e.id === bank.country_id} style={{ textTransform: 'capitalize' }} value={e.id}>{e.name}</option>
                          })
                          : null
                      }
                    </select>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className='col-6'>
                    <label htmlFor="account_type" className='form-label'>Tipo de cuenta <span className='Required'>*</span></label>
                    <Select
                      inputId='account_type'
                      name='account_type'
                      options={accountTypes}
                      placeholder="Selecciona el tipo de cuenta"
                      noOptionsMessage={()=> "No hay coincidencias"} />
                  </div>
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
          <button onClick={handleUser} className='btn btn-primary'>Editar banco</button>
        </Modal.Footer>
        </Modal>
      : null
  )
}

export default ModalEditBank
