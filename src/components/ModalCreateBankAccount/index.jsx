import React, { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getBanks } from '../../helpers/banks'
import { createBankAccount } from '../../helpers/banksAccounts'
import Select from 'react-select'
import { getUsers } from '../../helpers/users'

const ModalCreateBankAccount = ({ modalShow, setModalShow }) => {
  const [alertType, setAlertType] = useState('danger')
  const [banks, setBanks] = useState([]);
  const [errorMessage, setErrorMessage] = useState()
  const [users, setUsers] = useState();
  const form = useRef()
  useEffect(() => {
    getBanks(`paginated=no`).then(r =>{
      setBanks(r.map( e=> {
        return{
          label: `${e.name}`,
          value: e.id
        }
      }))
    }); 
    getUsers(`paginated=no`).then(r =>{
      setUsers(r.map( e=> {
        return{
          label: `${e.name} - ${e.email}`,
          value: e.id
        }
      }))
    }); 
  }, [])
  const handleBankAccount = async () => {
    try {
      const formData = form.current;
      const request = await createBankAccount({
        name: formData.name.value,
        identifier: formData.identifier.value,
        bank: formData.bank.value,
        user: formData.user.value
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
                <label htmlFor='name' className='form-label'>Nombre <span className='Required'>*</span></label>
                <input required className='form-control' type='text' name='name' id='name' />
              </div>
              <div className='col'>
                <label htmlFor='identifier'  className='form-label'>Identificador <span className='Required'>*</span></label>
                <input required className='form-control' type='text' name='identifier' />
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
                />
              </div>
              <div className="col">
                <label htmlFor="store" className='form-label'>Encargado <span className='Required'>*</span></label>
                <Select
                  placeholder="Seleccione un manejador"
                  noOptionsMessage={()=> "No hay coincidencias"}
                  name='user'
                  options={users}
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
