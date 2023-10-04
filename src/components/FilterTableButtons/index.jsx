import React from 'react'
import "./FilterTableButtons.css"

const FilterTableButtons = ({data, callback}) => {
  return (
    <fieldset className='d-flex'>
      {
        Array.isArray(data)
        ?data.map(
          e =>
          <div key={e.id} className='me-2'>
            <input onChange={()=> callback(e.id)} type='radio' name='filter_type' value={e.id}  id={e.id} style={{display: "none"}}/>
            <label htmlFor={e.id} style={{textTransform: 'capitalize'}} className='filter-type'>{e.name} <span>{e.count}</span></label>      
          </div>
        )
        :null
      }
    </fieldset>
  );
}

export default FilterTableButtons