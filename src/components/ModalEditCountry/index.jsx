import { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { updateCountry } from '../../helpers/countries'
import { getCurrencies } from '../../helpers/currencies';
import Select from 'react-select';

const ModalEditCountry = ({ modalShow, setModalShow, country }) => {
  const [currencies, setCurrencies] = useState([]);
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const form = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const currencyResponse = await getCurrencies("paginated=no");

      if (currencyResponse) setCurrencies(
        currencyResponse.map(({name, shortcode, id}) => ({label: name.concat(" (", shortcode, ")"), value: id}))
      );
    }

    fetchData();
  }, [])

  const handleCountry = async () => {
    try {
      const formData = new FormData(form.current)
      const request = await updateCountry(country.id_country, formData);

      switch (request.status) {
        case 201:
          setErrorMessage('País editado con éxito')
          setAlertType('success')

          window.location.reload()
          break
        case 422:
          setErrorMessage(request.data.message)
          setAlertType('danger')
          break

        default:
          setErrorMessage('Error en la edicion del país')
          setAlertType('danger')
          break
      }
    } catch (error) {
      setErrorMessage('Error en la edicion del país')
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
                <span className='ModalTopTitle'>Editar país</span>
                <span className='ModalTopSubTitle'>Esta pestaña le permite editar un nuevo país con su respectiva moneda.</span>
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          country 
          &&
          <form className='FormContainer' action='' ref={form}>
          <div className="container">
            <div className='row mb-3'>
              <div className='col'>
                <label htmlFor='name' className='form-label'>Nombre del país <span className='Required'>*</span></label>
                <input defaultValue={country.country_name} required className='form-control' type='text' id='name' name='country_name' placeholder='Venezuela'/>
              </div>
              <div className='col'>
                <label htmlFor='identifier'  className='form-label'>Código del país <span className='Required'>*</span></label>
                <input defaultValue={country.shortcode} required className='form-control' type='text' id='identifier' name='country_shortcode' placeholder='VE'/>
              </div>
            </div>
            <div className='row'>
              <div className='col-6'>
                <label htmlFor='locale' className='form-label'>Código local <span className='Required'>*</span></label>
                <input defaultValue="" required className='form-control' type='text' id='locale' name='locale' />
              </div>
              <div className='col-6'>
                <label htmlFor='currency_id' className='form-label'>Moneda <span className='Required'>*</span></label>
                <Select inputId='currency_id' name='currency_id' options={currencies} defaultValue={{ label: country.currency_name.concat(" (", country.currency_shortcode, ")"), value: country.currency_id }} placeholder="Selecciona una moneda" noOptionsMessage={() => "No hay coincidencias."} />
              </div>
            </div>
          </div>
        </form>
        }
      </Modal.Body>
      <Modal.Footer>
        {
          errorMessage
            ? <Alert variant={alertType} style={{ maxWidth: '100%', textAlign: 'center' }}>
              {errorMessage}
            </Alert>
            : null
        }
        <button onClick={handleCountry} className='btn btn-primary'>Editar país</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalEditCountry
