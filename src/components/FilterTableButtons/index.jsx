import React from 'react'
import "./FilterTableButtons.css"

const FilterTableButtons = ({data, callback}) => {
  return (
    <fieldset className='d-flex'>
      {
        data.map(
          e =>
          <div key={e.id} className='me-2'>
            <input onChange={()=> callback()} type='radio' name='filter-type' value={e.id}  id={e.id} style={{display: "none"}}/>
            <label htmlFor={e.id} className='filter-type'>{e.title} <span>{e.num}</span></label>      
          </div>
        )
      }
    </fieldset>
  );
}

export default FilterTableButtons