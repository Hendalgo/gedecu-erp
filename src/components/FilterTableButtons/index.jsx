import React from 'react'
import "./FilterTableButtons.css"
import { useUUID } from '../../hooks/useUUID';

const FilterTableButtons = ({data, callback}) => {
  const UUID = useUUID();
  return (
    <fieldset className='d-flex'>
      
      <div className='me-2'>
        <input  value={false} id={UUID} onChange={()=> callback(false)} type='radio' name='filter_type' style={{display: "none"}}/>
        <label htmlFor={UUID} style={{textTransform: 'capitalize'}} className='filter-type'>Todos</label>      
      </div>
      {
        
        Array.isArray(data)
        ?data.map(
          e =>
          <div key={e.id} className='me-2'>
            <input onChange={()=> callback(e.id)} type='radio' name='filter_type' value={e.id}  id={e.id} style={{display: "none"}}/>
            <label htmlFor={e.id} style={{textTransform: 'capitalize'}} className='filter-type'>{e.name} {/*<span>{e.count}</span>*/}</label>      
          </div>
        )
        :null
      }
    </fieldset>
  );
}

export default FilterTableButtons