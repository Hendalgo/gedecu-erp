import React, { useEffect, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { createReport, getReportTypes } from '../../helpers/reports';
import { getBanks } from '../../helpers/banks';
import { useMask } from '../../hooks/useMask';
import { getStores } from '../../helpers/stores';
import { useUUID } from '../../hooks/useUUID';
import { useUnmask } from '../../hooks/useUnmask';
import { Alert } from 'react-bootstrap';
const ModalCreateReport = ({modalShow, setModalShow}) => {
  const form = useRef();
  const [errorMessage, setErrorMessage] = useState(false);
  const [reportTypes, setReportTypes] = useState([]);
  const [alertType, setAlertType] = useState('danger');
  const [stores, setStores] = useState([]);
  const [options, setOptions] = useState({
    rate: false,
    bank_income: false,
    payment_reference: false,
    store: true, 
    bank: true, 
    notes: true,
    duplicated: true
  })
  const [display, setDisplay] = useState({
    banks_income: 'hidden',
    banks: 'hidden',
    stores: 'hidden'
  })
  const [banks, setBanks] = useState([]) 
  const [amount, setAmount] = useState("");
  const [tasa, setTasa] = useState("");
  const handleReport = async()=>{
    try {
      setErrorMessage(false)
      const formData = form.current
      let data = {
        amount: useUnmask(formData.amount.value),
        type: parseInt(formData.type.value),
        duplicated: formData.duplicated.checked,
        bank: formData.bank.id,
        store: formData.store.id,
        notes: formData.notes.value  
      };
      formData.rate?data.rate = useUnmask(formData.rate.value): null;
      formData.bank_income?data.bank_income = formData.bank_income.id: null;
      formData.payment_reference? data.payment_reference = formData.payment_reference.value:null;
     
      const request = await createReport(data);

      switch (request.status) {
        case 201:
          setErrorMessage('Reporte creado con éxito');
          setAlertType('success');
          
          window.location.reload();
          break;
        case 422:
          setErrorMessage(request.data.message);
          setAlertType('danger')
          break;
      
        default:
          setErrorMessage("Error en la creación del Reporte");
          setAlertType('danger')
          break;
      }

    } catch (error) {
      setErrorMessage("Error en la creación del Reporte");
      setAlertType('danger')
    }
  }
  useEffect(()=>{
    getReportTypes().then(r => setReportTypes(r));
  },[]);

  const handleSearchBank = (e)=>{
    getBanks(`search=${e.target.value}`).then(r => setBanks(r.data));
  }
  const handleSearchSet = (e, el, hide)=>{  
    el.value = e.name
    el.id = e.id
    setDisplay({
      ...display,
      [hide]: 'hidden'
    })

  }
  const handleSearchStore = (e)=>{
    getStores(`search=${e.target.value}`).then(r=> setStores(r.data));
  }
  const handleType = (e)=>{
    switch (e.target.value) {
      case "1":
        setOptions({
          rate: true,
          bank_income: true,
          payment_reference: false,
          store: true, 
          bank: true, 
          notes: true,
          duplicated: true
        })
        break;
      case "2":
        setOptions({
          rate: true,
          bank_income: false,
          payment_reference: true,
          store: true, 
          bank: true, 
          notes: true,
          duplicated: true
        })
        break;
      default:
        setOptions({
          rate: false,
          bank_income: false,
          payment_reference: false,
          store: true, 
          bank: true, 
          notes: true,
          duplicated: false
        })
        break;
    }
  }
  return (
    <Modal show={modalShow} size='lg' onHide={()=> setModalShow(false)}>
    <Modal.Header closeButton>
      <Modal.Title>
        <div className="container">
          <div className="row">
            <div className='d-flex flex-column'>
              <span className='ModalTopTitle'>Crear Reporte</span>
              <span className='ModalTopSubTitle'>Reporte</span>
            </div>
          </div>
        </div>
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <form ref={form} action="">
        <div className="container">
          <div className="row">
            <div className="col-8">
              <label htmlFor="type"  className='form-label'>Tipo de reporte</label>
              <select onChange={handleType} className='form-control' name="type" id="">
                <option value="">Seleccione un tipo de reporte...</option>
                {
                  reportTypes.length> 0 
                  ?reportTypes.map((e)=>
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ):null
                }
              </select>
            </div>
            
            <div className="col-4">
              <label htmlFor="" className='form-label'>Monto <span className='Required'>*</span></label>
              <input required placeholder='000.000,00' onChange={(e)=> setAmount(e.target.value)} onBlur={(e)=> useMask(e, setAmount)} value={amount} type="text" name='amount' className='form-control' />
            </div>
            
          </div>
          <div className="row mt-3">
            {
              options.rate
              ?
              <div className='col-4'>
                <label htmlFor="rate" className='form-label' >Tasa del día <span className='Required'>*</span></label>
                <input required placeholder='123.456,78' name='rate' onChange={(e)=> setTasa(e.target.value)} onBlur={(e)=> useMask(e, setTasa)} value={tasa} type="text" className='form-control' />
              </div>
              :null
            }
            {
              options.payment_reference
              ?
              <div className="col-4">
                <label htmlFor="payment_reference"  className='form-label'>Referencia de pago</label>
                <input type="text" className="form-control"  name='payment_reference'/>
              </div>
              :null
            }
            {
              options.bank_income
              ?<div className="col-4">
                <label htmlFor="bank_inconme"  className='form-label'>Banco - Entrada</label>
                <input autoComplete="off"onChange={handleSearchBank} onBlur={()=>  setTimeout(() => setDisplay({...display, banks_income: 'hidden'}), 100)} onFocus={()=> setDisplay({...display, banks_income: 'visible'})} className='form-control' type="search" name="bank_income"  id='bank_income'/>
                <fieldset className='UserSearch' style={{visibility: display.banks_income}}>
                {
                  banks.length > 0
                  ?banks.map((e)=>{
                    const uuid = useUUID();
                    return <div key={e.name} >
                      <label htmlFor={uuid}  >
                        <span className='SearchResultName'>
                          {e.name}
                        </span>
                      </label>
                      <input onClick={()=> handleSearchSet(e, form.current.bank_income, 'bank_income')} type="radio" name="bank_45" value={e.id} id={uuid}  />
                    </div>
                  })
                  :null
                }
                </fieldset>
              </div>
              :null
            }
          </div>
          <div className="row mt-3">
            <div className="col-4">
              <label htmlFor="store"  className='form-label'>Local</label>
              <input autoComplete="off"onChange={handleSearchStore} onBlur={()=>  setTimeout(() => setDisplay({...display, stores: 'hidden'}), 100)} onFocus={()=> setDisplay({...display, stores: 'visible'})} className='form-control' type="search" name="store" />
              <fieldset className='UserSearch' style={{visibility: display.stores}}>
              {
                stores.length > 0
                ?stores.map((e)=>{
                  
                  const uuid = useUUID();
                  return <div key={uuid} >
                    <label htmlFor={uuid}>
                      <span className='SearchResultName'>
                        {e.name}
                      </span>
                    </label>
                    <input onClick={()=> handleSearchSet(e, form.current.store, 'stores')} type="radio" name="stores" value={e.id} id={uuid} />
                  </div>
                })
                :null
              }
              </fieldset>
            </div>
            <div className="col-4">
              <label htmlFor="bank_inconme"  className='form-label'>Banco</label>
              <input autoComplete="off"onChange={handleSearchBank} onBlur={()=>  setTimeout(() => setDisplay({...display, banks: 'hidden'}), 100)} onFocus={()=> setDisplay({...display, banks: 'visible'})} className='form-control' type="search" name='bank'/>
              <fieldset className='UserSearch' style={{visibility: display.banks}}>
              {
                banks.length > 0
                ?banks.map((e)=>{
                  
                  const uuid = useUUID();
                  return <div key={uuid} >
                    <label htmlFor={uuid}>
                      <span className='SearchResultName'>
                        {e.name}
                      </span>
                    </label>
                    <input onClick={()=> handleSearchSet(e, form.current.bank, 'bank')} type="radio" name="bank_5454" value={e.id} id={uuid} />
                  </div>
                })
                :null
              }
              </fieldset>
            </div>
            <div className="col-4 mt-4">
              <div className=' d-flex align-items-center'>
                <input className="form-check-input" type="checkbox" name="duplicated" id="" />
                <label htmlFor="" className='form-check-label'>¿Movimiento Duplicado?</label>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12">
              <label htmlFor="" className='form-label' >Notas</label>
              <textarea name="notes" className='form-control' id="" ></textarea>
            </div>
          </div>
        </div>
      </form>
    </Modal.Body>
    <Modal.Footer>
      {
        errorMessage?
        <Alert variant={alertType} style={{maxWidth:'100%', textAlign: 'center'}}>
          {errorMessage}
        </Alert>
        :null
      }
      <button onClick={handleReport} className='btn btn-primary'>Crear reporte</button>
    </Modal.Footer>
  </Modal>
  )
}

export default ModalCreateReport