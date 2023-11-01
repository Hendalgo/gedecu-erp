import { useState } from "react"
import { useUUID } from "../../hooks/useUUID";
const SearchSelect = ({nameRadio, label, data, nameSearch, handleSearch, form, hasDescription, description, defaultValue}) => {
  const [display, setDisplay] = useState('hidden');
  const handleSearchSet = (e, el) => {
    el.value = e.name
    el.id = e.id
    setDisplay('hidden')
  }
  return (
    <>
      <label htmlFor={nameSearch} className='form-label'>{label}</label>
      {
        defaultValue ?
        <input defaultValue={defaultValue.name} autoComplete='off' onChange={handleSearch} onBlur={() => setTimeout(() => setDisplay('hidden'), 100)} onFocus={() => setDisplay('visible')} className='form-control' type='search' name={nameSearch} id={defaultValue.id} />
        :<input autoComplete='off' onChange={handleSearch} onBlur={() => setTimeout(() => setDisplay('hidden'), 100)} onFocus={() => setDisplay('visible')} className='form-control' type='search' name={nameSearch} />
      }
      <fieldset className='UserSearch' style={{ visibility: display}}>
        {
          data.length > 0
          ? data.map((e) => {
            const uuid = useUUID()
            return (
              <div key={uuid}>
                <label htmlFor={uuid}>
                  <span className='SearchResultName'>
                    {e.name}
                  </span>
                  {
                    hasDescription &&
                    <>
                      {
                        description.map((i, index) => {
                          return (
                            <span className='SearchResultDescription'>
                              {obtenerValor(e, i)}
                            </span>
                          );
                        })
                      }
                    </>
                  }
                </label>
                <input onClick={() => handleSearchSet(e, form.current[nameSearch])} type='radio' name={nameRadio} value={e.id} id={uuid} />
              </div>
            )
          })
          : null
        }
      </fieldset>
    </>
  )
}
function obtenerValor(objeto, ruta) {
  let keys = ruta.split('.');
  let valor = objeto;

  for (let key of keys) {
      valor = valor[key];
      if (valor === undefined) {
          return undefined;
      }
  }

  return valor;
}

export default SearchSelect