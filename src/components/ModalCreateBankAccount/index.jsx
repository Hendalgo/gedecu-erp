import React, { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getBanks, getCountriesCount } from '../../helpers/banks'
import SearchSelect from '../SearchSelect'
import { createBankAccount } from '../../helpers/banksAccounts'

const ModalCreateBankAccount = ({ modalShow, setModalShow }) => {
  const [countries, setCountries] = useState();
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const form = useRef()
  useEffect(() => {
    getCountriesCount().then(r => setCountries(r))
  }, [])
  const handleBankAccount = async () => {
    try {
      const formData = form.current;
      const request = await createBankAccount({
        name: formData.name.value,
        identifier: formData.identifier.value,
        bank: formData.bank.value
      });

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
  const handleSearch = async (e)=>{
    try {
      const banks = await getBanks(`search=${e}`);
      return banks.data;
    } catch (error) {
      
    }
  }
  return (
    <Modal show={modalShow} size='lg' onHide={() => setModalShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className='container'>
            <div className='row'>
              <div className='d-flex flex-column'>
                <span className='ModalTopTitle'>Crear nueva cuenta bancaria</span>
                <span className='ModalTopSubTitle'>Esta pestaña le permite crear una nueva cuenta bancaria o de alguna otra plataforma monetaria.</span>
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
                <label htmlFor='name' className='form-label'>Nombre</label>
                <input required className='form-control' type='text' name='name' id='name' />
              </div>
              <div className='col'>
                <label htmlFor='identifier'  className='form-label'>Identificador</label>
                <input required className='form-control' type='text' name='identifier' />
              </div>
            </div>
            <div className="row">
              <div className='col'>
                <SearchSelect
                    nameSearch={'bank'}
                    label={'Banco'}
                    handleSearch={handleSearch}
                    description={['name', 'country.name']}
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
        <button onClick={handleBankAccount} className='btn btn-primary'>Crear banco</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalCreateBankAccount
