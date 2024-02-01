import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useFormatDate } from '../../hooks/useFormatDate'
import { getBank, getBanks } from '../../helpers/banks'
import reportsColumnsMap from '../../consts/ReportsColumnsMap'

const ModalViewReport = ({ modalShow, setModalShow, report }) => {
  const [info, setInfo] = useState()
  let tableHeader = [];
  let tableBody = [];

  useEffect(() => {
    if (report) {
      // let data = {}
      // data.Monto = <span style={{ textWrap: 'nowrap' }}>{`${report.bank_account.bank.currency.shortcode} ${report.bank_account.bank.currency.symbol} ${report.amount.toLocaleString('de-DE', { minumunfractions: 2 })}`}</span>
      // meta_data.rate ? data.Tasa = <span style={{ textWrap: 'nowrap' }}>{`${report.bank_account.bank.currency.symbol} ${meta_data.rate.toLocaleString('de-DE', { minumunfractions: 2 })}`}</span> : null
      // data = {
      //   ...data,
      //   Banco: <span style={{ backgroundColor: styles.backgroundColor, color: styles.color, border: `1px solid ${styles.borderColor}`, borderRadius: 4, padding: 4, textWrap: 'nowrap' }}>{report.bank_account.bank.name}</span>, 
      //   "Cuenta de:" : report.bank_account.name,
      //   "Identificador" : report.bank_account.identifier,
      //   Duplicado: <span>{report.duplicated ? 'Sí' : 'No'}</span>
      // }
      // report.account_manager? data['Encargado de la cuenta'] = report.account_manager.name: null;
      // report.bank? data['Banco solicitado'] = report.bank.name : null;
      // report.duplicated_status ? report.duplicated_status === 'done' ? data['Estado de corrección'] = 'Dinero Devuelto' : data['Estado de corrección'] = 'Cancelado' : data['Estado de corrección'] = 'Sin revisar'
      // data['I. chequeada'] = report.inconsistence_checked ? 'Sí' : 'No'
      // report.store? data.Local = report.store.name : null
      // // data['Reporte Realizado por'] = report.user.name
      // data.Notas = report.notes
      // setInfo(data)
          
    }
  }, [report])

  console.log(report)
  console.log(info)

  const reportStyles = JSON.parse(report.type.config).styles;
  const headerSet = new Set();

  JSON.parse(report.meta_data).forEach((subreport) => {
    const newTableEntry = {};

    Object.keys(subreport).forEach((key) => {
      if (reportsColumnsMap.has(key)) {
        headerSet.add(reportsColumnsMap.get(key));
        let value = subreport[key];

        if (["amount", "rate", "conversion"].includes(key)) {
          value = new Number(value).toLocaleString("es-VE", {
            maximumFractionDigits: 2, minimumFractionDigits: 2,
          });
        }

        if (key === "isDuplicated") {
          if (value) {
            value = "Sí";
          } else {
            value = "No";
          }
        }

        newTableEntry[key] = value;
      }
    });

    tableBody.push(newTableEntry);
  });

  tableHeader = Array.from(headerSet);

  return (
    report
      ? <Modal show={modalShow} size='lg' onHide={() => setModalShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <div className='container'>
                <div className='row'>
                  <div className='d-flex flex-column'>
                    <span className='ModalTopSubTitle'>Rol: Rol</span>
                    <span className='ModalTopTitle'>{report.user.name}</span>
                    <div className='row'>
                      <div className='col'>
                        <span style={{ ...reportStyles, fontSize: "12px", borderWidth: "2px", borderStyle: "solid", borderRadius: 4, padding: 4, textWrap: 'nowrap' }}>{report.type.name}</span>
                        <span className='ms-2' style={{ fontSize: "12px" }}> { useFormatDate(report.created_at) } </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='container'>
              <div className='row overflow-auto'>
                {
                  tableHeader ?
                  <table className='table table-striped tableP'>
                    <thead>
                      <tr>
                        { tableHeader.map((header, index) => <th key={index}>{header}</th>) }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        tableBody.map((report, rowIndex) => {
                          return <tr key={rowIndex}>
                            {
                              Object.values(report).map((value, childIndex) => {
                                return <td key={`child-${childIndex}`}>{value}</td>
                              })
                            }
                          </tr>
                        })
                      }
                    </tbody>
                    <tfoot></tfoot>
                  </table> :
                  "Este reporte no tiene información"
                }
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className='row'>
              <div className='col text-end'>
                Buttons

              </div>
            </div>
          </Modal.Footer>
        </Modal>
      : null
  )
}

export default ModalViewReport
