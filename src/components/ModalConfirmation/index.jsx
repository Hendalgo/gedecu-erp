import { Modal } from "react-bootstrap"

const ModalConfirmation = ({show, setModalShow, action, text = "", warning = "", confirmButtonLabel = "Eliminar"}) => {
  return (
    <Modal show={show} onHide={()=>setModalShow(false)} size="md" centered>
      <Modal.Header>
        <Modal.Title style={{textAlign: 'center'}}>
          {
            warning ? warning : <span>¿Está seguro de querer eliminar este {text}?</span>
          }
          
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <button className="btn btn-danger" onClick={()=>{action(); setModalShow(false)}}>{confirmButtonLabel}</button>
        <button className="btn btn-secondary" onClick={()=>setModalShow(false)}>Cancelar</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalConfirmation