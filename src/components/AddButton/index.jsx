import React from 'react'
import { ReactSVG } from 'react-svg'
import "./AddButton.css";

const AddButton = ({text = "reporte"}) => {
  return (
    <div className="d-sm-flex align-items-center bg-white AddButtonContainer">
      <ReactSVG
        src='/plus.svg'
        className='AddButtonIconContainer'
        wrapper='span'
      />
      <div className="d-sm-flex flex-column ps-3 AddButtonTextContainer">
        <span >Nuevo</span>
        <span className='AddText'>{text}</span>
      </div>
    </div>
  )
}

export default AddButton