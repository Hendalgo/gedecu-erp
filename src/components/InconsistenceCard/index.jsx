import { Card, Badge } from "react-bootstrap"
import './InconsistenceCard.css';
import CheckButton from "../CheckButton";
import PropTypes from 'prop-types'
import { useFormatDate } from "../../hooks/useFormatDate";

const InconsistenceCard = ({report, showModal, checkReport}) => {
  const styles = JSON.parse(report.type.config).styles;
  return (
  <Card className="mb-3 InconsistenceCard" >
    <Card.Body>
      <Card.Title className="mb-2 mt-2 d-flex justify-content-between">
        <div className="d-flex flex-column">
          <span className="mb-2">{report.store.name}</span>
          <span className="mb-2 text-muted" style={{fontSize: 12}}>Realizado por: {report.user.name}</span>
          <span className="fs-6 fw-normal">{useFormatDate(report.created_at)}</span>
        </div>
        <div className="d-flex flex-column align-items-end">
          <span className="fs-6 fw-normal" style={{ border: `1px solid ${styles.borderColor}`, backgroundColor: styles.backgroundColor, color: styles.color, padding: '2px 8px', borderRadius: '4px' }}>{report.type.name}</span>
          <button className='btn' onClick={()=>showModal(report)}>
            <svg xmlns='http://www.w3.org/2000/svg' width='17' height='13' viewBox='0 0 17 13' fill='none'>
              <path d='M15.7875 4.42276C14.1685 1.92492 11.4045 0.405734 8.42802 0.377808C5.45154 0.405734 2.68754 1.92492 1.06859 4.42276C0.215419 5.67484 0.215419 7.32149 1.06859 8.5736C2.68663 11.073 5.45079 12.5937 8.42805 12.6226C11.4045 12.5946 14.1685 11.0755 15.7875 8.57762C16.6425 7.3246 16.6425 5.67575 15.7875 4.42276ZM14.1309 7.43838C12.8949 9.39888 10.7456 10.595 8.42802 10.6122C6.11048 10.595 3.9612 9.39888 2.72514 7.43838C2.3398 6.87226 2.3398 6.12809 2.72514 5.562C3.96116 3.60151 6.11045 2.4054 8.42802 2.38822C10.7456 2.40537 12.8948 3.60151 14.1309 5.562C14.5162 6.12809 14.5162 6.87226 14.1309 7.43838Z' fill='#0D6EFD' />
              <path d='M8.4281 9.18066C9.90852 9.18066 11.1086 7.98054 11.1086 6.50012C11.1086 5.0197 9.90852 3.81958 8.4281 3.81958C6.94768 3.81958 5.74756 5.0197 5.74756 6.50012C5.74756 7.98054 6.94768 9.18066 8.4281 9.18066Z' fill='#0D6EFD' />
            </svg>
          </button>
        </div>
      </Card.Title>
    </Card.Body>
    <Card.Footer className="bg-white">
      <Card.Text className="d-flex justify-content-between align-items-center">
          <span>{report.bank.name}</span>
          <span className="fw-medium fs-4">{report.bank.country.currency.symbol} {report.amount.toLocaleString('de-DE', {minimunfractions: 2})}</span>
          {
            !report.inconsistence_check
            ?<CheckButton action={checkReport} id={report.id} />
            :null
          }
        </Card.Text>
      </Card.Footer>
  </Card>
  )
}
InconsistenceCard.propTypes = {
  report: PropTypes.object.isRequired
}

export default InconsistenceCard