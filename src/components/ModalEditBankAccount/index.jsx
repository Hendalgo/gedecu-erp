import { useRef, useState } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { getBanks} from '../../helpers/banks'
import { updateBankAccount } from '../../helpers/banksAccounts'
import { useEffect } from 'react'
import Select from 'react-select'
import DecimalInput from '../DecimalInput'
import { getCurrencies } from '../../helpers/currencies'

const ModalEditBankAccount = ({ modalShow, setModalShow, bankAccount }) => {
  const [banks, setBanks] = useState([]);
  const [alertType, setAlertType] = useState('danger')
  const [errorMessage, setErrorMessage] = useState()
  const [currencies, setCurrencies] = useState([]);
  const form = useRef();

  useEffect(() => {
    Promise.all([getBanks(`paginated=no`), getCurrencies("paginated=no")])
    .then(([banksResponse, currenciesResponse]) => {
      setBanks(banksResponse.map(e => ({ label: `${e.name}`, value: e.id } )));
      setCurrencies(currenciesResponse.map(({ name, shortcode, id }) => ({ label: name.concat(" (", shortcode, ")"), value: id })));
    })
    .catch(({error, message}) => {
      setErrorMessage(error.message);
      setAlertType("danger");
    })

    getBanks(`paginated=no`).then(r =>{
      setBanks(r.map( e=> {
        return{
          label: `${e.name}`,
          value: e.id
        }
      }))
    }); 
  }, [])

  const handleBankAccount = async () => {
    try {
      const formData = new FormData(form.current);
      formData["amount"] = new Number(formData["amount"].replace(/\D/g, "")) / 100;
      const request = await updateBankAccount(bankAccount.id, formData);

      switch (request.status) {
        case 201:
          setErrorMessage('Banco editado con éxito')
          setAlertType('success')

          window.location.reload()
          break
        case 422:
          setErrorMessage(request.data.message)
          setAlertType('danger')
          break

        default:
          setErrorMessage('Error en la edición del banco')
          setAlertType('danger')
          break
      }
    } catch (error) {
      setErrorMessage('Error en la edición del banco')
      setAlertType('danger')
    }
  }
  const handleSearch = async (e)=>{
    try {
      const banks = await getBanks(`search=${e}`);
      return banks.data;
    } catch (error) {
      
    }
  }

  return (
    <Modal show={modalShow} size='lg' onHide={() => setModalShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className='container'>
            <div className='row'>
              <div className='d-flex flex-column'>
                <span className='ModalTopTitle'>Editar nueva cuenta bancaria</span>
                <span className='ModalTopSubTitle'>Esta pestaña le permite Editar una nueva cuenta bancaria o de alguna otra plataforma monetaria.</span>
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          bankAccount
          ?
          <form className='FormContainer' action='' ref={form}>
            <div className="container">
              <div className='row mb-3'>
                <div className='col'>
                  <label htmlFor='name' className='form-label'>Nombre <span className='Required'>*</span></label>
                  <input defaultValue={bankAccount.name} required className='form-control' type='text' name='name' id='name' />
                </div>
                <div className='col'>
                  <label htmlFor='identifier'  className='form-label'>Identificador <span className='Required'>*</span></label>
                  <input defaultValue={bankAccount.identifier} required className='form-control' type='text' id='identifier' name='identifier' />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col'>
                  <label htmlFor="bank" className='form-label'>Banco <span className='Required'>*</span></label>
                  <Select
                    placeholder="Seleccione un banco"
                    noOptionsMessage={()=> "No hay coincidencias"}
                    inputId='bank'
                    name='bank'
                    options={banks}
                    defaultValue={{
                      label: `${bankAccount.bank.name} - ${bankAccount.bank.country.name} -`,
                      value: bankAccount.bank.id
                    }}
                  />
                </div>
                <div className="col">
                  <label htmlFor="currency" className='form-label'>Moneda <span className='Required'>*</span></label>
                  <Select
                    placeholder="Seleccione una moneda"
                    noOptionsMessage={()=> "No hay coincidencias"}
                    inputId='currency'
                    name='currency'
                    options={currencies}
                    defaultValue={{label: `${bankAccount.currency.name} (${bankAccount.currency.shortcode})`, value: bankAccount.currency.id}}
                  />
                </div>
              </div>
              <div className="row">
              <div className='col-6'>
                <label htmlFor="amount" className='form-label'>Monto inicial <span className='Required'>*</span></label>
                <DecimalInput id='amount' name='amount' readOnly defaultValue={bankAccount.balance.toLocaleString("es-VE", {minimumFractionDigits: 2})} />
              </div>
            </div>
            </div>
          </form>
          :null
        }
      </Modal.Body>
      <Modal.Footer>
        {
          errorMessage
            ? <Alert variant={alertType} style={{ maxWidth: '100%', textAlign: 'center' }}>
              {errorMessage}
            </Alert>
            : null
        }
        <button onClick={handleBankAccount} className='btn btn-primary'>Editar cuenta</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalEditBankAccount
