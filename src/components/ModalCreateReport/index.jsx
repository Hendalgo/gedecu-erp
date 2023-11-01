import React, { useEffect, useRef, useState } from 'react'
import { Modal, Alert, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { createReport, getReportTypes } from '../../helpers/reports'
import { useMask } from '../../hooks/useMask'
import { getStores } from '../../helpers/stores'
import { useUUID } from '../../hooks/useUUID'
import { useUnmask } from '../../hooks/useUnmask'
import SearchSelect from '../SearchSelect'
import { getBankAccounts } from '../../helpers/banksAccounts'

const ModalCreateReport = ({ modalShow, setModalShow }) => {
  const form = useRef()
  const [errorMessage, setErrorMessage] = useState(false)
  const [reportTypes, setReportTypes] = useState([])
  const [alertType, setAlertType] = useState('danger')
  const [stores, setStores] = useState([])
  const [options, setOptions] = useState({
    rate: true,
    payment_reference: false,
    store: true,
    bank: true,
    notes: true,
    duplicated: true,
    bank_account_ie: false
  })
  const [banks, setBanks] = useState([]);
  const [banksDesc, setBanksDesc] = useState([]);
  const [amount, setAmount] = useState('')
  const [tasa, setTasa] = useState('')
  const handleReport = async () => {
    try {
      setErrorMessage(false)
      const formData = form.current
      const data = {
        amount: useUnmask(formData.amount.value),
        type: parseInt(formData.type.value),
        duplicated: formData.duplicated.checked,
        bank: formData.bank.id,
        store: formData.store.id,
        notes: formData.notes.value
      }
      formData.rate ? data.rate = useUnmask(formData.rate.value) : null
      console.log(formData)
      formData.bank_account_ie ? data.bank_income = formData.bank_account_ie.id : null
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
    getReportTypes().then(r => setReportTypes(r))
  }, [])

  const handleSearchBank = (e) => {
    getBankAccounts(`search=${e.target.value}`)
    .then(r => {
      setBanks(r.data);
      setBanksDesc(['bank.name', 'bank.country.name']);
    })
  }
  const handleSearchStore = (e) => {
    getStores(`search=${e.target.value}`).then(r => setStores(r.data))
  }
  const handleType = (e) => {
    const type =  reportTypes.find( el => el.id === parseInt(e.target.value));
    if (type.type === 'income') {
      setOptions({
        ...options,
        bank_account_ie: true
      })
    }
    else if(type.type === 'expense'){
      setOptions({
        ...options,
        bank_account_ie: true
      })
    }
    else{
      setOptions({
        ...options,
        bank_account_ie: false
      })
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
                <span className='ModalTopSubTitle'>Reporte</span>
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
                <label htmlFor='type' className='form-label'>Tipo de reporte</label>
                <select onChange={handleType} className='form-control' name='type' id=''>
                  <option value=''>Seleccione un tipo de reporte...</option>
                  {
                  reportTypes.length > 0
                    ? reportTypes.map((e) =>
                      <option key={e.id} value={e.id}>{e.name}</option>
                    )
                    : null
                }
                </select>
              </div>

              <div className='col'>
                <label htmlFor='' className='form-label'>Monto <span className='Required'>*</span></label>
                <input required placeholder='000.000,00' onChange={(e) => setAmount(e.target.value)} onBlur={(e) => useMask(e, setAmount)} value={amount} type='text' name='amount' className='form-control' />
              </div>

            </div>
            <div className='row mt-3'>
              {
                options.rate
                ? <div className='col-4'>
                  <label htmlFor='rate' className='form-label'>Tasa del día <span className='Required'>*</span></label>
                  <input required placeholder='123.456,78' name='rate' onChange={(e) => setTasa(e.target.value)} onBlur={(e) => useMask(e, setTasa)} value={tasa} type='text' className='form-control' />
                </div>
                : null
              } 
              <div className='col-4'>
                <label htmlFor='payment_reference' className='form-label'>Referencia de pago</label>
                <input type='text' className='form-control' name='payment_reference' />
              </div>
              {
              options.bank_account_ie
                ?<div className='col-4'>
                  <SearchSelect
                    nameRadio={'bank-448797'}
                    nameSearch={'bank_account_ie'}
                    handleSearch={handleSearchBank}
                    label={'Cuenta'}
                    data={banks}
                    form={form}
                    hasDescription={true}
                    description={banksDesc}
                  />
                </div>
                : null
              }
            </div>
            <div className='row mt-3'>
              <div className='col-4'>
                <SearchSelect 
                  handleSearch={handleSearchStore} 
                  nameRadio='stores' 
                  nameSearch='store' 
                  label='Local' 
                  data={stores}
                  form={form}
                />
              </div>
              <div className='col-4'>
                <SearchSelect
                  nameRadio={'bank-48897'}
                  nameSearch={'bank'}
                  handleSearch={handleSearchBank}
                  label={'Cuenta'}
                  data={banks}
                  form={form}
                  hasDescription={true}
                  description={banksDesc}
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
