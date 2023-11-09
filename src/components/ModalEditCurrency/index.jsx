import React, { useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { createCurrency, updateCurrency } from '../../helpers/currencies'

const ModalEditCurrency = ({ modalShow, setModalShow, currency }) => {
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const form = useRef();

  const handleCurrency = async () => {
    try {
      const request = await updateCurrency(currency.id, {
        name: form.current.name.value,
        symbol: form.current.symbol.value,
        shortcode: form.current.shortcode.value
      });

      switch (request.status) {
        case 201:
          setErrorMessage('Moneda editada con éxito')
          setAlertType('success')

          window.location.reload()
          break
        case 422:
          setErrorMessage(request.data.message)
          setAlertType('danger')
          break

        default:
          setErrorMessage('Error en la edicion de la moneda')
          setAlertType('danger')
          break
      }
    } catch (error) {
      setErrorMessage('Error en la edicion de la moneda')
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
                <span className='ModalTopTitle'>Editar moneda</span>
                <span className='ModalTopSubTitle'></span>
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className='FormContainer' action='' ref={form}>
          <div className="container">
            <div className='row mb-3'>
              <div className='col'>
                <label htmlFor='name' className='form-label'>Nombre de la moneda</label>
                <input defaultValue={currency.name} required className='form-control' type='text' name='name' placeholder='Dólar estadounidense'/>
              </div>
              <div className='col'>
                <label htmlFor='identifier'  className='form-label'>Código de la moneda</label>
                <input defaultValue={currency.shortcode} required className='form-control' type='text' name='shortcode' placeholder='USD'/>
              </div>
              <div className='col'>
                <label htmlFor='identifier'  className='form-label'>Símbolo de la moneda</label>
                <input defaultValue={currency.symbol} required className='form-control' type='text' name='symbol' placeholder='$'/>
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
        <button onClick={handleCurrency} className='btn btn-primary'>Editar moneda</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalEditCurrency
