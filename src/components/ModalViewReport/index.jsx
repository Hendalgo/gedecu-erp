import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useFormatDate } from '../../hooks/useFormatDate'
import { getBank, getBanks } from '../../helpers/banks'

const ModalViewReport = ({ modalShow, setModalShow, report }) => {
  const [info, setInfo] = useState()

  useEffect(() => {
    if (report) {
      let data = {
      }
      const meta_data = JSON.parse(report.meta_data)
      const styles = JSON.parse(report.type.config).styles
      data.Monto = <span style={{ textWrap: 'nowrap' }}>{`${report.bank_account.bank.currency.shortcode} ${report.bank_account.bank.currency.symbol} ${report.amount.toLocaleString('de-DE', { minumunfractions: 2 })}`}</span>
      meta_data.rate ? data.Tasa = <span style={{ textWrap: 'nowrap' }}>{`${report.bank_account.bank.currency.symbol} ${meta_data.rate.toLocaleString('de-DE', { minumunfractions: 2 })}`}</span> : null
      data = {

        'Tipo de reporte': <span style={{ backgroundColor: styles.backgroundColor, color: styles.color, border: `1px solid ${styles.borderColor}`, borderRadius: 4, padding: 4, textWrap: 'nowrap' }}>{report.type.name}</span>,
        ...data,
        Banco: <span style={{ backgroundColor: styles.backgroundColor, color: styles.color, border: `1px solid ${styles.borderColor}`, borderRadius: 4, padding: 4, textWrap: 'nowrap' }}>{report.bank_account.bank.name}</span>, 
        "Cuenta de:" : report.bank_account.name,
        "Identificador" : report.bank_account.identifier,
        Duplicado: <span>{report.duplicated ? 'Sí' : 'No'}</span>
      }
      report.bank? data['Banco solicitado'] = report.bank.name : null;
      report.duplicated_status ? report.duplicated_status === 'done' ? data['Estado de corrección'] = 'Dinero Devuelto' : data['Estado de corrección'] = 'Cancelado' : data['Estado de corrección'] = 'Sin revisar'
      data['I. chequeada'] = report.inconsistence_checked ? 'Sí' : 'No'
      report.store? data.Local = report.store.name : null
      data['Reporte Realizado por'] = report.user.name
      data.Notas = report.notes
      setInfo(data)
          
    }
  }, [report])
  return (
    report
      ? <Modal show={modalShow} size='lg' onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className='container'>
              <div className='row'>
                <div className='d-flex flex-column'>
                  <span className='ModalTopTitle'>ID {report.id}</span>
                  <span className='ModalTopSubTitle'>{useFormatDate(report.created_at)}</span>
                </div>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='container mt-4'>
            <div className='row'>
              {info && Object.keys(info).map((key, index) => (
                index % 4 === 0 && <div className='w-100' />,
                  <div key={key} className='col mb-4'>
                    <div className='d-flex flex-column'>
                      <span className='ModalBodyTitle mb-1' style={{ textWrap: 'nowrap' }}>{key}</span>
                      <span className='ModalBodyContent' style={key !== 'Notas'? { textWrap: 'nowrap' }: {textWrap: 'wrap'}}>{info[key]}</span>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        </Modal>
      : null
  )
}

export default ModalViewReport
