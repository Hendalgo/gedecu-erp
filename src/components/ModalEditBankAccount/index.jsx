import React, { useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getBanks} from '../../helpers/banks'
import SearchSelect from '../SearchSelect'
import { updateBankAccount } from '../../helpers/banksAccounts'

const ModalEditBankAccount = ({ modalShow, setModalShow, bankAccount }) => {
  const [banks, setBanks] = useState([]);
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const form = useRef();
  const handleBankAccount = async () => {
    try {
      const formData = form.current;
      const request = await updateBankAccount(bankAccount.id,{
        name: formData.name.value,
        identifier: formData.identifier.value,
        bank: formData.bank.id
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
  const handleSearch = (e)=>{
    getBanks(`search=${e.target.value}`).then(r => setBanks(r.data));
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
        {
          bankAccount
          ?
          <form className='FormContainer' action='' ref={form}>
            <div className="container">
              <div className='row mb-3'>
                <div className='col'>
                  <label htmlFor='name' className='form-label'>Nombre</label>
                  <input defaultValue={bankAccount.name} required className='form-control' type='text' name='name' id='name' />
                </div>
                <div className='col'>
                  <label htmlFor='identifier'  className='form-label'>Identificador</label>
                  <input defaultValue={bankAccount.identifier} required className='form-control' type='text' name='identifier' />
                </div>
              </div>
              <div className="row">
                <div className='col'>
                  <SearchSelect
                    nameRadio={'banks'}
                    nameSearch={'bank'}
                    label={'Banco'}
                    data={banks}
                    handleSearch={handleSearch}
                    form={form}
                    defaultValue={{
                      name: bankAccount.bank.name,
                      id: bankAccount.bank.id
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
          :null
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
        <button onClick={handleBankAccount} className='btn btn-primary'>Crear banco</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalEditBankAccount
