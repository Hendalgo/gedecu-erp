import { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { createCurrency } from '../../helpers/currencies'
import { getCountries } from '../../helpers/countries'
import Select from 'react-select'

const ModalCreateCurrency = ({ modalShow, setModalShow }) => {
  const [countries, setCountries] = useState([]);
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const [loading, setLoading] = useState(false);
  const form = useRef();

  useEffect(() => {
    setLoading(true);
    getCountries("paginated=no&order=name")
    .then((response) => {
      if (response) setCountries(response.data.map(({name, shortcode, id}) => ({ label: `${name} (${shortcode})`, value: id })));
    })
    .catch(({message, error}) => {
      setErrorMessage(message);
      setAlertType("danger");
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  const handleCurrency = async () => {
    setLoading(true);
    try {
      const request = await createCurrency(form.current);

      switch (request.status) {
        case 201:
          setErrorMessage('Moneda creada con éxito')
          setAlertType('success')

          window.location.reload()
          break
        case 422:
          setErrorMessage(request.data.message)
          setAlertType('danger')
          break

        default:
          setErrorMessage('Error en la creación de la moneda')
          setAlertType('danger')
          break
      }
    } catch (error) {
      setErrorMessage('Error en la creación de la moneda')
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
                <span className='ModalTopTitle'>Crear una nueva moneda</span>
                <span className='ModalTopSubTitle'>Esta pestaña le permite crear una nueva moneda la cual asociar puede asociar a multiples bancos</span>
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className='FormContainer' action='' ref={form} autoComplete='off'>
          <div className="container">
            <div className='row mb-3'>
              <div className='col'>
                <label htmlFor='name' className='form-label'>Nombre de la moneda <span className='Required'>*</span></label>
                <input required className='form-control' type='text' id='name' name='name' placeholder='Dólar estadounidense'/>
              </div>
              <div className='col'>
                <label htmlFor='shortcode'  className='form-label'>Código de la moneda <span className='Required'>*</span></label>
                <input required className='form-control' type='text' id='shortcode' name='shortcode' placeholder='USD'/>
              </div>
              <div className='col'>
                <label htmlFor='symbol' className='form-label'>Símbolo de la moneda <span className='Required'>*</span></label>
                <input required className='form-control' type='text' id='symbol' name='symbol' placeholder='$'/>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <label htmlFor='country' className='form-label'>País</label>
                <Select inputId='country' name='country_id' options={countries} placeholder="Seleccione un país" noOptionsMessage={() => "No hay coincidencias"} />
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
        <button onClick={handleCurrency} className='btn btn-primary' disabled={loading}>Crear moneda</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalCreateCurrency
