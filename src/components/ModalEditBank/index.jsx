import React, { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getCountriesCount, updateBank } from '../../helpers/banks'
import { getCurrencies } from '../../helpers/currencies'
import Select from 'react-select'

const ModalEditBank = ({ modalShow, setModalShow, bank, setBank }) => {
  const [countries, setCountries] = useState()
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const [currencies, setCurrencies] = useState([])
  const form = useRef()
  useEffect(() => {
    getCountriesCount().then(r => setCountries(r))
    getCurrencies('paginated=no').then(r =>{
      setCurrencies(r.map( e=> {
        return{
          label: `${bank.currency.name} - ${bank.currency.symbol}`,
          value: e.id
        }
      }))
    });
  }, [])
  const handleUser = async () => {
    try {
      const request = await updateBank(bank.id, {
        name: bank.name,
        country: form.current.country.value,
        currency: form.current.currency.value
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
            <form className='FormContainer' action='' ref={form}>
              <div className='container'>
                <div className="row">
                  <div className='col'>
                    <label htmlFor='name'>Nombre <span className='Required'>*</span></label>
                    <input required onChange={(e) => setBank({ ...bank, name: e.target.value })} className='form-control' type='text' name='name' value={bank.name} />
                  </div>
                  <div className='col'>
                    <label htmlFor='country'>País <span className='Required'>*</span></label>
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
                <div className="row mt-3">
                  <div className='col'>
                    <label htmlFor="bank" className='form-label'>Moneda <span className='Required'>*</span></label>
                    <Select
                      placeholder="Seleccione una moneda"
                      noOptionsMessage={()=> "No hay coincidencias"}
                      name='currency'
                      options={currencies}
                      defaultValue={{
                        label: `${bank.currency.name} - ${bank.currency.symbol}`,
                        value: bank.currency.id
                      }}
                    />
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
