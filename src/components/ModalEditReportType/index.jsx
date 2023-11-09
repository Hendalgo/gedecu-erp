import { useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import Select from 'react-select'
import { createReportTypes, updateReportTypes } from '../../helpers/reports'

const ModalEditReportType = ({ modalShow, setModalShow, data }) => {
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const form = useRef()
  const handleEdit = async () => {
    try {
      const formData = form.current;
      const request = await updateReportTypes(data.id, {
        name: formData.name.value,
        description: formData.description.value,
        type: formData.type.value
      });
      switch (request.status) {
        case 201:
          setErrorMessage('Tipo editado con éxito')
          setAlertType('success')

          window.location.reload()
          break
        case 422:
          setErrorMessage(request.data.message)
          setAlertType('danger')
          break

        default:
          setErrorMessage('Error en la edición del tipo')
          setAlertType('danger')
          break
      }
    } catch (error) {
      setErrorMessage('Error en la edición del tipo')
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
                <span className='ModalTopTitle'>Editar nuevo tipo de reporte</span>
                <span className='ModalTopSubTitle'>Esta pestaña le permite editar un nuevo tipo de reporte</span>
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          data &&
          <form className='FormContainer' action='' ref={form}>
          <div className="container">
            <div className='row mb-3'>
              <div className='col'>
                <label htmlFor='name' className='form-label'>Nombre</label>
                <input defaultValue={data.name} required className='form-control' type='text' name='name' id='name' placeholder='E.j: Tranferencia enviada' />
              </div>
              <div className='col'>
                <label htmlFor="type" className='form-label' >Tipo</label>
                <Select
                  placeholder="Selecciona un tipo"
                  name='type'
                    options={[{
                      label: 'Ingreso',
                      value: 'income',
                    },{
                      label: 'Egreso',
                      value: 'expense',
                    },{
                      label: 'Neutro',
                      value: 'neutro',
                  }]}
                  defaultValue={
                    {
                      label: data.type === 'income'? 'Ingreso': data.type === 'expense'? 'Egreso':'Neutro',
                      value: data.type
                    }
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor='description'  className='form-label'>Descripción</label>
                <textarea defaultValue={data.description} name="description" id="" className='form-control' ></textarea>
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
        <button onClick={handleEdit} className='btn btn-primary'>Editar tipo</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalEditReportType
