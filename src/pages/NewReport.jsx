import React, { useEffect, useRef, useState } from 'react'
import './NewReports.css'
import useInputMask from '../hooks/useInputMask'

function parseLocaleNumber (stringNumber, locale) {
  const thousandSeparator = Intl.NumberFormat(locale).format(11111).replace(/\p{Number}/gu, '')
  const decimalSeparator = Intl.NumberFormat(locale).format(1.1).replace(/\p{Number}/gu, '')

  return parseFloat(stringNumber
    .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
    .replace(new RegExp('\\' + decimalSeparator), '.')
  )
}

const NewReport = () => {
  const [amount, setAmount] = useState('')
  const [tasa, setTasa] = useState('')
  const handleMask = (e, setValue) => {
    let input = e.target.value
    // Elimina cualquier caracter no numérico excepto la coma
    input = input.replace(/[^0-9,]/g, '')
    // Reemplaza la coma por un punto para poder convertirlo a un número
    input = input.replace(',', '.')
    // Convierte el string a un número
    let number = parseFloat(input)
    // Comprueba si el número es válido
    if (isNaN(number)) {
      number = 0
    }
    // Formatea el número con dos decimales y usando la coma como separador decimal y el punto para los miles
    const formattedNumber = number.toLocaleString('de-DE', { minimumFractionDigits: 2 })
    setValue(formattedNumber)
  }
  return (
    <div className='container'>
      <div className='row WelcomeContainer pt-4 pb-3'>
        <div className='d-flex justify-content-between'>
          <div className=''>
            <h4>Nuevo reporte</h4>
          </div>
          <div className=''>
            <div className='d-flex align-items-center g-4'>
              <input form='new-report' type='submit' value='Crear Reporte' className='btn btn-primary' />
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <form id='new-report' action='' className='mt-5 form-group FormContainer'>
            <div className='container'>
              <div className='row mb-5'>
                <div className='col-4'>
                  <label htmlFor='' className='form-label'>Monto <span className='Required'>*</span></label>
                  <input required placeholder='000.000,00' onChange={(e) => setAmount(e.target.value)} onBlur={(e) => handleMask(e, setAmount)} value={amount} type='text' className='form-control' />
                </div>
                <div className='col-4'>
                  <label htmlFor='' className='form-label'>Tasa del día <span className='Required'>*</span></label>
                  <input required placeholder='123.456,78' onChange={(e) => setTasa(e.target.value)} onBlur={(e) => handleMask(e, setTasa)} value={tasa} type='text' className='form-control' />
                </div>
                <div className='col-4'>
                  <label htmlFor='' className='form-label'>Local <span className='Required'>*</span></label>
                  <select name='' id='' className='form-select'>
                    <option value=''>Local 1</option>
                    <option value=''>Local 1</option>
                    <option value=''>Local 1</option>
                    <option value=''>Local 1</option>

                  </select>
                </div>
              </div>
              <div className='row mb-5'>
                <div className='col-4'>
                  <label htmlFor='' className='form-label'>Tipo de reporte <span className='Required'>*</span></label>
                  <select name='' id='' className='form-select'>
                    <option value=''>Please select</option>
                    <option value=''>Local 1</option>
                    <option value=''>Local 1</option>
                    <option value=''>Local 1</option>
                  </select>
                </div>
                <div className='col-4'>
                  <label htmlFor='' className='form-label'>Método de pago <span className='Required'>*</span></label>
                  <select name='' id='' className='form-select'>
                    <option value=''>Please select</option>
                    <option value=''>Local 1</option>
                    <option value=''>Local 1</option>
                    <option value=''>Local 1</option>

                  </select>
                </div>
                <div className='col-4'>
                  <label htmlFor='' className='form-label'>Fecha del movimiento <span className='Required'>*</span></label>
                  <input required type='date' className='form-control' />
                </div>
              </div>
              <div className='row mb-5'>
                <div className='col-4'>
                  <label htmlFor='' className='form-label'>Recibido de: <span className='Required'>*</span></label>
                  <input placeholder='Nombre Apellido' type='text' className='form-control' />
                </div>
                <div className='col-4'>
                  <label htmlFor='' className='form-label'>N. Referencia <span className='Required'>*</span></label>
                  <input placeholder='1685961185' type='text' className='form-control' />
                </div>
                <div className='col-4'>

                  <div className=' d-flex align-items-center'>
                    <input className='form-check-input' type='checkbox' name='' id='' />
                    <label htmlFor='' className='form-check-label'>¿Movimiento Duplicado?</label>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-8'>
                  <label htmlFor='' className='form-label'>Notas</label>
                  <textarea className='form-control' name='' id='' />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewReport
