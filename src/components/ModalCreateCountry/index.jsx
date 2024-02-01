import { useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { createCountry } from '../../helpers/countries'

const ModalCreateCountry = ({ modalShow, setModalShow }) => {
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const handleCountry = async () => {
    setLoading(true);
    try {
      const request = await createCountry(form.current);

      switch (request.status) {
        case 201:
          setErrorMessage('País creado con éxito')
          setAlertType('success')

          window.location.reload()
          break
        case 422:
          setErrorMessage(request.data.message)
          setAlertType('danger')
          break

        default:
          setErrorMessage('Error en la creación del país')
          setAlertType('danger')
          break
      }
    } catch (error) {
      setErrorMessage('Error en la creación del país')
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
                <span className='ModalTopTitle'>Crear un nuevo país</span>
                <span className='ModalTopSubTitle'>Esta pestaña le permite crear un nuevo país con su respectiva moneda.</span>
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className='FormContainer' ref={form} autoComplete='off'>
          <div className="container">
            <div className='row mb-3'>
              <div className='col'>
                <label htmlFor='country_name' className='form-label'>Nombre del país <span className='Required'>*</span></label>
                <input required className='form-control' type='text' id='country_name' name='country_name' placeholder='Venezuela'/>
              </div>
              <div className='col'>
                <label htmlFor='country_shortcode' className='form-label'>Código del país <span className='Required'>*</span></label>
                <input required className='form-control' type='text' id='country_shortcode' name='country_shortcode' placeholder='VE'/>
              </div>
            </div>
            <div className='row'>
              <div className='col-6'>
                <label htmlFor='locale' className='form-label'>Código local <span className='Required'>*</span></label>
                <input required className='form-control' type='text' id='locale' name='locale' placeholder='es-VE'/>
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
        <button onClick={handleCountry} className='btn btn-primary' disabled={loading}>Crear país</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalCreateCountry
