import React from 'react'

const SearchBar = ({text, search, change}) => {
  const handleSumbit = e=>{
    e.preventDefault();
  }
  return (
    <div>
      <form className="d-flex form-group" onSubmit={e => handleSumbit(e)} action="">
          
        <input type="text" name="" id="" className='form-control' placeholder={`${text.replace(/\b\w/g , function(m){ return m.toUpperCase(); } )}...`} autoComplete='none' />
        <input type="submit" className='btn btn-primary' value={`Buscar ${text}`} />
      </form>
    </div>
  )
}

export default SearchBar