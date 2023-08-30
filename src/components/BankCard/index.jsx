import React from 'react'
import "./BankCard.css"
const BankCard = ({amount, currency, name, icon}) => {
  return (
    <div className='d-flex align-items-center mb-2'>
      <div>
        <img src={icon} alt={name} className='BankImage img-fluid' />
      </div>
      <div className='d-flex flex-column'>
        <span className='BankName'>{name}</span>
        <span className='BankAmount'>{currency} {amount}</span>
      </div>
    </div>
  )
}

export default BankCard