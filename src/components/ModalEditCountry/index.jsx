import React, { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { createCountry, updateCountry } from '../../helpers/countries'

const ModalEditCountry = ({ modalShow, setModalShow, country }) => {
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const form = useRef();

  const handleCountry = async () => {
    try {
      const formData = new FormData(form.current)
      const request = await updateCountry(country.id_country, {
        country_name: formData.get("country_name"),
        country_shortcode: formData.get("country_shortcode")
      });

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
                <input defaultValue={country.country_name} required className='form-control' type='text' name='country_name' placeholder='Venezuela'/>
              </div>
              <div className='col'>
                <label htmlFor='identifier'  className='form-label'>Código del país <span className='Required'>*</span></label>
                <input defaultValue={country.shortcode} required className='form-control' type='text' name='country_shortcode' placeholder='VE'/>
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