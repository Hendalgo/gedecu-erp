import React, { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { createUser, getUsersRoles } from '../../helpers/users'
import { createBank, getCountriesCount } from '../../helpers/banks'
import { getCurrencies } from '../../helpers/currencies'
import Select from 'react-select'
const ModalCreateBank = ({ modalShow, setModalShow }) => {
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
          label: `${e.name} - ${e.symbol}`,
          value: e.id
        }
      }))
    });
  }, [])
  const handleUser = async () => {
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
  }
  return (
    <Modal show={modalShow} size='lg' onHide={() => setModalShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className='container'>
            <div className='row'>
              <div className='d-flex flex-column'>
                <span className='ModalTopTitle'>Crear Nuevo banco</span>
                <span className='ModalTopSubTitle'>Esta pestaña le permite crear un nuevo banco</span>
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className='FormContainer' action='' ref={form}>
          <div className='container'>
            <div className="row">
              <div className='col me-4'>
                <label htmlFor='name'>Nombre</label>
                <input required className='form-control' type='text' name='name' />
              </div>
              <div className='col'>
                <label htmlFor='country'>País</label>
                <select required className='form-select' name='country' id=''>
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
              <div className='col'>
                <label htmlFor="bank" className='form-label'>Moneda <span className='Required'>*</span></label>
                <Select
                  placeholder="Seleccione una moneda"
                  noOptionsMessage={()=> "No hay coincidencias"}
                  name='currency'
                  options={currencies}
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
        <button onClick={handleUser} className='btn btn-primary'>Crear banco</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalCreateBank
