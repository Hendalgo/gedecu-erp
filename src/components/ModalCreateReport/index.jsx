import React, { useEffect, useRef, useState } from 'react'
import { Modal, Alert} from 'react-bootstrap'
import { createReport, getReportTypes } from '../../helpers/reports'
import { getStores } from '../../helpers/stores'
import { useUnmask } from '../../hooks/useUnmask'
import { getBankAccounts } from '../../helpers/banksAccounts'
import DecimalInput from '../DecimalInput'
import Select from 'react-select';

const ModalCreateReport = ({ modalShow, setModalShow }) => {
  const form = useRef()
  const [currency, setCurrency] = useState('');
  const [banks, setBanks] = useState([]);
  const [stores, setStores] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false)
  const [reportTypes, setReportTypes] = useState([])
  const [alertType, setAlertType] = useState('danger')
  const [options, setOptions] = useState({
    rate: false,
    payment_reference: false,
    store: true,
    bank: true,
    notes: true,
    duplicated: true,
    bank_account_ie: false
  })
  const handleReport = async () => {
    try {
      setErrorMessage(false)
      const formData = form.current
      const data = {
        amount: useUnmask(formData.amount.value),
        type: parseInt(formData.type.value),
        duplicated: formData.duplicated.checked,
        bank: formData.bank.value,
        store: formData.store.value,
        notes: formData.notes.value
      }
      formData.rate ? data.rate = useUnmask(formData.rate.value) : null
      formData.bank_account_ie ? data.bank_income = formData.bank_account_ie.value : null
      formData.payment_reference ? data.payment_reference = formData.payment_reference.value : null

      const request = await createReport(data)

      switch (request.status) {
        case 201:
          setErrorMessage('Reporte creado con éxito')
          setAlertType('success')

          window.location.reload()
          break
        case 422:
          setErrorMessage(request.data.message)
          setAlertType('danger')
          break

        default:
          setErrorMessage('Error en la creación del Reporte')
          setAlertType('danger')
          break
      }
    } catch (error) {
      setErrorMessage('Error en la creación del Reporte')
      setAlertType('danger')
    }
  }
  useEffect(() => {
    getReportTypes(`paginated=no`).then(r => {
      if (Array.isArray(r)) {
        const income = r.filter(e => e.type === 'income').map(e => ({ value: e.id, label: e.name, type: e.type }));;
        const expense =  r.filter(e=> e.type === 'expense').map(e => ({ value: e.id, label: e.name, type: e.type }));;
        const neutro = r.filter(e=> e.type === 'neutro').map(e => ({ value: e.id, label: e.name, type: e.type }));;

        setReportTypes([
          {
            label: 'Ingreso',
            options: income
          },
          {
            label: 'Egreso',
            options: expense
          },
          {
            label: 'Neutro',
            options: neutro
          },
        ])
      }
    });
    getStores(`paginated=no`).then(r =>{
      setStores(r.map( e=> {
        return{
          label: e.name,
          value: e.id
        }
      }))
    }); 
    getBankAccounts(`paginated=no`).then(r =>{
      setBanks(r.map( e=> {
        return{
          label: `${e.name} - ${e.identifier}`,
          value: e.id,
          currency: e.bank.country.currency.symbol
        }
      }))
    }); 
  }, [])
  const handleType = (e) => {
    const type =  reportTypes.map( el => el.options).flat().find(el => el.value === e.value);
    if (type) {
      if (type.type === 'income') {
        !form.current.bank_account_ie && setCurrency('');
        setOptions({
          ...options,
          rate: true,
          payment_reference: true,
          bank_account_ie: true
        })
      }
      else if(type.type === 'expense'){
        !form.current.bank_account_ie && setCurrency('');
        setOptions({
          ...options,
          rate: true,
          payment_reference: false,
          bank_account_ie: true
        })
      }
      else{
        const bank = banks.find(el => el.id === parseFloat(form.current.bank.value));
        if (bank) {
          setCurrency(bank.bank.country.currency.symbol)
        }
        setOptions({
          ...options,
          rate: false,
          bank_account_ie: false,
          payment_reference: false,
        })
      }
    }
  }
  const handleChange = (e)=>{
    const bank = banks.find(el => el.value === e.value);
    setCurrency(bank.currency)
  }
  const handleChangeNeutral = (e) =>{
    if (!options.bank_account_ie) {
      const bank = banks.find(el => el.value === e.value);
      setCurrency(bank.currency)
    }
  }
  return (
    <Modal show={modalShow} size='lg' onHide={() => setModalShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className='container'>
            <div className='row'>
              <div className='d-flex flex-column'>
                <span className='ModalTopTitle'>Crear Reporte</span>
                <span className='ModalTopSubTitle'>En esta pestaña puedes crear un reporte nuevo. Los tipos de reporte se dividen en Ingreso, egreso o neutral. Las de tipo ingreso o egreso agregan el campo "Cuenta de operacion" el cual implica a que cuenta se debitaran o agregaran los fondos de la operacion y la moneda en que se basará la tasa y el monto. 
                Di marcas el movimiento como duplicado la operación se realizará 2 veces. Ejemplo si haces un movimiento de tipo egreso de $5. A la cuenta se debitaran $10.
                </span>
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form ref={form} action=''>
          <div className='container'>
            <div className='row'>
              <div className='col'>
                <label htmlFor='type' className='form-label'>Tipo de reporte <span className='Required'>*</span></label>
                <Select
                  onChange={handleType}
                  options={reportTypes}
                  name='type'
                />
              </div>

              <div className='col'>
                <label htmlFor='' className='form-label'>Monto <span className='Required'>*</span></label>
                <div className="input-group">
                  <div className="input-group-text">{currency}</div>
                  <DecimalInput name={"amount"}/>
                </div>
              </div>

            </div>
            <div className='row mt-3'>
              {
                options.rate
                &&
                <div className='col-4'>
                  <label htmlFor='rate' className='form-label'>Tasa del día</label>
                  <div className="input-group">
                    <div className="input-group-text">{currency}</div>
                  <DecimalInput name={"rate"}/>
                </div>
                </div>
              } 
              {
                options.payment_reference && 
                <div className='col-4'>
                  <label htmlFor='payment_reference' className='form-label'>Referencia de pago</label>
                  <input type='text' className='form-control' name='payment_reference' placeholder='E.j: 091052507122' />
                </div>
              }
              {
                options.bank_account_ie
                &&<div className='col-4'>
                  <label htmlFor="bank" className='form-label'>Cuenta <span className='Required'>*</span></label>
                  <Select
                    onChange={handleChange}
                    placeholder="Seleccione una cuenta"
                    noOptionsMessage={()=> "No hay coincidencias"}
                    name='bank_account_ie'
                    options={banks}
                  />
                </div>
              }
            </div>
            <div className='row mt-3'>
              <div className='col-4'>
                <label htmlFor="store" className='form-label'>Local <span className='Required'>*</span></label>
                <Select
                  placeholder="Seleccione un local"
                  noOptionsMessage={()=> "No hay coincidencias"}
                  name='store'
                  options={stores}
                />
              </div>
              <div className='col-4'>
                <label htmlFor="bank" className='form-label'>Cuenta <span className='Required'>*</span></label>
                <Select
                  onChange={handleChangeNeutral}
                  placeholder="Seleccione una cuenta"
                  noOptionsMessage={()=> "No hay coincidencias"}
                  name='bank'
                  options={banks}
                />
              </div>
              <div className='col-4 mt-4'>
                <div className=' d-flex align-items-center'>
                  <input className='form-check-input' type='checkbox' name='duplicated' id='' />
                  <label htmlFor='' className='form-check-label'>¿Movimiento Duplicado?</label>
                </div>
              </div>
            </div>
            <div className='row mt-3'>
              <div className='col-12'>
                <label htmlFor='' className='form-label'>Notas</label>
                <textarea name='notes' className='form-control' id='' />
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
        <button onClick={handleReport} className='btn btn-primary'>Crear reporte</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalCreateReport
