import React, { useEffect, useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { createUser, getUsersRoles } from '../../helpers/users';
import { createBank, getCountriesCount } from '../../helpers/banks';

const ModalCreateBank = ({modalShow, setModalShow}) => {
  const [countries, setCountries] = useState();
  const [alertType, setAlertType] = useState('danger');
  const [errorMessage, setErrorMessage] = useState();
  const form = useRef();
  useEffect(()=>{
    getCountriesCount().then(r => setCountries(r));
  }, []);
  const handleUser =  async()=>{
    try {
      const formData = new FormData(form.current);
      const request = await createBank(formData);

      switch (request.status) {
        case 201:
          setErrorMessage('Banco creado con éxito');
          setAlertType('success');
          
          window.location.reload();
          break;
        case 422:
          setErrorMessage(request.data.message);
          setAlertType('danger')
          break;
      
        default:
          setErrorMessage("Error en la creación del banco");
          setAlertType('danger')
          break;
      }
    } catch (error) {
        setErrorMessage("Error en la creación del banco");
        setAlertType('danger')
    }
  }
  return (
    <Modal show={modalShow} size='lg' onHide={()=> setModalShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="container">
            <div className="row">
              <div className='d-flex flex-column'>
                <span className='ModalTopTitle'>Crear Nuevo banco</span>
                <span className='ModalTopSubTitle'>Esta pestaña le permite crear un nuevo banco</span>
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="d-flex">
            <form className='FormContainer' action="" ref={form}>
            <div className='d-flex mb-3'>
              <div className='me-4'>
                <label htmlFor="name">Nombre</label>
                <input required className='form-control' type="text" name='name' />
              </div>
              <div>
                <label htmlFor="amount">Monto inicial del banco</label>
                <input required className='form-control' type="text" name='amount' /> 
              </div>
            </div> 
            <div className="d-flex mb-3">
              <div>
                <label htmlFor="country_id">País</label>
                <select required className="form-select" name="country_id" id="">
                  {
                    countries?
                    countries.map(e=>{
                      return <option  key={e.id} style={{textTransform: 'capitalize'}} value={e.id}>{e.name}</option>
                    })
                    :null
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
          errorMessage?
          <Alert variant={alertType} style={{maxWidth:'100%', textAlign: 'center'}}>
            {errorMessage}
          </Alert>
          :null
        }
        <button onClick={handleUser} className='btn btn-primary'>Crear banco</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalCreateBank