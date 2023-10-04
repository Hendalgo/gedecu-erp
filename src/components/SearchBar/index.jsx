import React from 'react'

const SearchBar = ({text, search, change}) => {
  const handleSumbit = e=>{
    e.preventDefault();
  }
  return (
    <div className='d-flex'>
      <input name='search' type="text"  id="" className='form-control' placeholder={`${text.replace(/\b\w/g , function(m){ return m.toUpperCase(); } )}...`} autoComplete='none' />
      <input type="submit" className='btn btn-primary' value={`Buscar ${text}`} />
    </div>
  )
}

export default SearchBar