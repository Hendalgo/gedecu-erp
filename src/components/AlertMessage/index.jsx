import { Alert } from "react-bootstrap"

const AlertMessage = ({show, setShow, message, variant = 'primary'}) => {
  return (
    show
    &&
    <Alert  variant={variant} className="AlertContainer" onClose={()=> setShow({...show, show: false})} dismissible >
      {message}
    </Alert>
  )
}

export default AlertMessage