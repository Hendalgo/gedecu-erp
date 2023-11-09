import React, { useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getBanks} from '../../helpers/banks'
import SearchSelect from '../SearchSelect'
import { updateBankAccount } from '../../helpers/banksAccounts'
import { useEffect } from 'react'
import Select from 'react-select'
const ModalEditBankAccount = ({ modalShow, setModalShow, bankAccount }) => {
  const [banks, setBanks] = useState([]);
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const form = useRef();
  useEffect(() => {
    getBanks(`paginated=no`).then(r =>{
      setBanks(r.map( e=> {
        return{
          label: `${e.name}`,
          value: e.id
        }
      }))
    }); 
  }, [])
  const handleBankAccount = async () => {
    try {
      const formData = form.current;
      const request = await updateBankAccount(bankAccount.id,{
        name: formData.name.value,
        identifier: formData.identifier.value,
        bank: formData.bank.value
      });

      switch (request.status) {
        case 201:
          setErrorMessage('Banco editado con éxito')
          setAlertType('success')

          window.location.reload()
          break
        case 422:
          setErrorMessage(request.data.message)
          setAlertType('danger')
          break

        default:
          setErrorMessage('Error en la edición del banco')
          setAlertType('danger')
          break
      }
    } catch (error) {
      setErrorMessage('Error en la edición del banco')
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
                <span className='ModalTopTitle'>Editar nueva cuenta bancaria</span>
                <span className='ModalTopSubTitle'>Esta pestaña le permite Editar una nueva cuenta bancaria o de alguna otra plataforma monetaria.</span>
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
                  <label htmlFor='name' className='form-label'>Nombre <span className='Required'>*</span></label>
                  <input defaultValue={bankAccount.name} required className='form-control' type='text' name='name' id='name' />
                </div>
                <div className='col'>
                  <label htmlFor='identifier'  className='form-label'>Identificador <span className='Required'>*</span></label>
                  <input defaultValue={bankAccount.identifier} required className='form-control' type='text' name='identifier' />
                </div>
              </div>
              <div className="row">
                <div className='col'>
                  <label htmlFor="bank" className='form-label'>Banco <span className='Required'>*</span></label>
                  <Select
                    placeholder="Seleccione un banco"
                    noOptionsMessage={()=> "No hay coincidencias"}
                    name='bank'
                    options={banks}
                    defaultValue={{
                      label: `${bankAccount.bank.name} - ${bankAccount.bank.country.name} -`,
                      value: bankAccount.bank.id
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
        <button onClick={handleBankAccount} className='btn btn-primary'>Editar banco</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalEditBankAccount
