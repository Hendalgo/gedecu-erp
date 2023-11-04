import AsyncSelect from 'react-select/async'
const SearchSelect = ({ label, nameSearch, handleSearch, description, defaultValue, onChange}) => {
  const loadOptions = async (e, callback) => {
    try {
      const data = await handleSearch(e);
      callback(data.map((v, i)=>{
        const labels = description.map( item =>{
          return obtenerValor(v, item);
        })
        let label = "";

        for (const i of labels) {
          label += i + " - ";
        }
        return{
          value: v.id,
          label: label  
        }
      }));
    } catch (error) {
      
    }
  }
  return (
    <>
      <label htmlFor={nameSearch} className='form-label'>{label}</label>
      {
        defaultValue
        ?<AsyncSelect
            onChange= {onChange}
            loadOptions={loadOptions}
            defaultValue={defaultValue}
            name={nameSearch}
        />
        :<AsyncSelect
          onChange= {onChange}
          loadOptions={loadOptions}
          name={nameSearch}
        />
      }
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