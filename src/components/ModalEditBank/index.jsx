import React, { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getCountriesCount, updateBank } from '../../helpers/banks'
import { useMaskStaless } from '../../hooks/useMask'
import { useUnmask } from '../../hooks/useUnmask'

const ModalEditBank = ({ modalShow, setModalShow, bank, setBank }) => {
  const [countries, setCountries] = useState()
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const form = useRef()
  useEffect(() => {
    getCountriesCount().then(r => setCountries(r))
  }, [])
  const handleUser = async () => {
    try {
      const request = await updateBank(bank.id, {
        name: bank.name,
        amount: useUnmask(form.current.amount.value),
        country_id: form.current.country.value
      })
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
          <div className='container'>
            <div className='row'>
              <div className='d-flex'>
                <form className='FormContainer' action='' ref={form}>
                  <div className='d-flex mb-3'>
                    <div className='me-4'>
                      <label htmlFor='name'>Nombre</label>
                      <input required onChange={(e) => setBank({ ...bank, name: e.target.value })} className='form-control' type='text' name='name' value={bank.name} />
                    </div>
                    <div>
                      <label htmlFor='amount'>Monto</label>
                      <input onBlur={(e) =>  e.target.value = useMaskStaless(e.target.value) } className='form-control' type='text' name='amount' defaultValue={useMaskStaless(bank.amount)} />
                    </div>
                  </div>
                  <div className='d-flex mb-3'>
                    <div>
                      <label htmlFor='country'>País</label>
                      <select required className='form-select' name='country' id=''>
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
          <button onClick={handleUser} className='btn btn-primary'>Editar banco</button>
        </Modal.Footer>
        </Modal>
      : null
  )
}

export default ModalEditBank
