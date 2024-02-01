import { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getBanksTypes, getCountriesCount, updateBank } from '../../helpers/banks'
import Select from 'react-select'

const ModalEditBank = ({ modalShow, setModalShow, bank, setBank }) => {
  const [countries, setCountries] = useState([]);
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const [accountTypes, setAccountTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const form = useRef()

  useEffect(() => {
    setLoading(true);
    Promise.all([ getCountriesCount(), getBanksTypes("paginated=no"), ])
    .then(([countries, banksTypes,]) => {
      setCountries(countries.map(({name, id}) => ({ label: name, value: id })));

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
      const formData = new FormData(form.current);
      const data = {};

      for (const [key, val] of formData.entries()) {
        data[key] = val;
      }

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
    setLoading(false);
  }
  return (
    bank
      ? <Modal show={modalShow} size='lg' onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className='container'>
              <div className='row'>
                <div className='d-flex flex-column'>
                  <span className='ModalTopTitle'>Editar banco</span>
                  <span className='ModalTopSubTitle'>Esta pestaña le permite editar un banco existente</span>
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
                    <Select
                      inputId='country'
                      name='country'
                      options={countries}
                      defaultValue={{ label: bank.country.name, value: bank.country_id }}
                      placeholder="Seleccione un país"
                      noOptionsMessage={() => "No hay coincidencias"} />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className='col-6'>
                    <label htmlFor="type_id" className='form-label'>Tipo de cuenta <span className='Required'>*</span></label>
                    <Select
                      inputId='type_id'
                      name='type_id'
                      options={accountTypes}
                      defaultValue={{label: bank.type.name, value: bank.type_id}}
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
          <button onClick={handleUser} className='btn btn-primary' disabled={loading}>Editar banco</button>
        </Modal.Footer>
        </Modal>
      : null
  )
}

export default ModalEditBank
