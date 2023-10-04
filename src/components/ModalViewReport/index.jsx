import React from 'react'
import { Modal } from 'react-bootstrap'
import { useFormatDate } from '../../hooks/useFormatDate'

const ModalViewReport = ({modalShow, setModalShow, report}) => {
  return (
    report?<Modal show={modalShow} size='lg' onHide={()=> setModalShow(false)}>
    <Modal.Header closeButton>
      <Modal.Title>
        <div className="container">
          <div className="row">
            <div className='d-flex flex-column'>
              <span className='ModalTopTitle'>ID {report.id}</span>
              <span className='ModalTopSubTitle'>{useFormatDate(report.created_at)}</span>
            </div>
          </div>
        </div>
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="container mt-4">
        <div className="row">
          <div className="col-3">
            <div className="d-flex flex-column">
              <span className='ModalBodyTitle mb-1'>Metodo de pago</span>
              <span className='ModalBodyContent'>{report.bank.name? report.bank.name:null}</span>
            </div>
          </div>
          <div className="col-3">
            <div className="d-flex flex-column">
              <span className='ModalBodyTitle mb-1'>Monto</span>
              <span className='ModalBodyContent'>{report.bank.country.currency.symbol?report.bank.country.currency.symbol:null} {report.amount.toLocaleString("de-DE", {minimumFractionDigits: 2})}</span>
            </div>
          </div>
          <div className="col-3">
            <div className="d-flex flex-column">
              <span className='ModalBodyTitle mb-1'>Tasa del día</span>
              <span className='ModalBodyContent'>Bs.S 32,00</span>
            </div>
          </div>
          <div className="col-3">
            <div className="d-flex flex-column">
              <span className='ModalBodyTitle mb-1'>Local</span>
              <span className='ModalBodyContent'>Local #1</span>
            </div>
          </div>
        </div>
        <div className="row mt-4">
        <div className="col-3">
            <div className="d-flex flex-column">
              <span className='ModalBodyTitle mb-1'>Cuenta de</span>
              <span className='ModalBodyContent'>Encargado - Luis</span>
            </div>
          </div>
          <div className="col-3">
            <div className="d-flex flex-column">
              <span className='ModalBodyTitle mb-1'>Recibido de</span>
              <span className='ModalBodyContent'>Luis X</span>
            </div>
          </div>
          <div className="col-3">
            <div className="d-flex flex-column">
              <span className='ModalBodyTitle mb-1'>N. Referencia</span>
              <span className='ModalBodyContent'>16898946213684</span>
            </div>
          </div>
          <div className="col-3">
            <div className="d-flex flex-column">
              <span className='ModalBodyTitle mb-1'>Motivo</span>
              <span className='ModalBodyContent'></span>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="d-flex flex-column">
            <span className='ModalBodyTitle mb-1'>Notas</span>
            <span className='ModalBodyContent'>Odio et nisl volutpat mauris ac sodales. Tempus nunc euismod ipsum commodo orci mattis nec sed at. Ullamcorper in interdum.</span>
          </div>
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <button className='btn btn-primary'>Editar</button>
    </Modal.Footer>
  </Modal>
  :null
  )
}

export default ModalViewReport