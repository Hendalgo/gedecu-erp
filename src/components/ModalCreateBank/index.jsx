import { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { createBank, getBanksTypes, getCountriesCount } from '../../helpers/banks'
import Select from 'react-select'

const ModalCreateBank = ({ modalShow, setModalShow }) => {
  const [countries, setCountries] = useState();
  const [accountTypes, setAccountTypes] = useState([]);
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const [loading, setLoading] = useState(false);
  const form = useRef()

  useEffect(() => {
    setLoading(true);
    Promise.all([ getCountriesCount(), getBanksTypes("paginated=no"), ])
    .then(([countries, banksTypes,]) => {
      setCountries(countries);
      const filteredBanksTypes = [];

      banksTypes.forEach(({name, id}) => {
        if (id !== 3) {
          filteredBanksTypes.push({label: name, value: id});
        }
      });

      setAccountTypes(filteredBanksTypes);
    }).catch(({error, message}) => {
      setErrorMessage(error.message);
      setAlertType("danger");
    }).finally(() => {
      setLoading(false);
    })
  }, [])

  const handleUser = async () => {
    setLoading(true);

    try {
      const formData = new FormData(form.current)
      const request = await createBank(formData)

      switch (request.status) {
        case 201:
          setErrorMessage('Banco creado con éxito')
          setAlertType('success')

          window.location.reload()
          break
        case 422:
          setErrorMessage(request.data.message)
          setAlertType('danger')
          break

        default:
          setErrorMessage('Error en la creación del banco')
          setAlertType('danger')
          break
      }
    } catch (error) {
      setErrorMessage('Error en la creación del banco')
      setAlertType('danger')
    }
    setLoading(false);
  }
  return (
    <Modal show={modalShow} size='lg' onHide={() => setModalShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className='container'>
            <div className='row'>
              <div className='d-flex flex-column'>
                <span className='ModalTopTitle'>Registrar banco</span>
                <span className='ModalTopSubTitle'>Esta pestaña le permite registrar un banco</span>
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className='FormContainer' action='' ref={form} autoComplete='off'>
          <div className='container'>
            <div className="row">
              <div className='col me-4'>
                <label htmlFor='name'>Nombre <span className='Required'>*</span></label>
                <input required className='form-control' type='text' name='name' id='name' />
              </div>
              <div className='col'>
                <label htmlFor='country'>País <span className='Required'>*</span></label>
                <select required className='form-select' name='country' id='country'>
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
            <div className="row mt-3">
              <div className='col-6'>
                <label htmlFor='type_id'>Tipo de cuenta <span className='Required'>*</span></label>
                <Select inputId='type_id' name='type_id' options={accountTypes} placeholder='Selecciona el tipo de cuenta' noOptionsMessage={() => "No hay coincidencias"} />
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
        <button onClick={handleUser} className='btn btn-primary' disabled={loading}>Registrar banco</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalCreateBank
