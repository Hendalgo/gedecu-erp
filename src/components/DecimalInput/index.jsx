import { useState, useEffect, useRef } from 'react';

const DecimalInput = ({ defaultValue = '0,00', name, id = "", onChange = () => null }) => {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef();

  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const handleInputChange = (e) => {
    let { value } = e.target;
    value = value.replace(/,/g, '').replace(/\./g, '');
    value = value.padStart(3, '0');
    const decimalPart = value.slice(-2);
    let integerPart = value.slice(0, -2);
    integerPart = parseInt(integerPart, 10).toString(); // Elimina los ceros a la izquierda
    onChange(new Number(`${integerPart}.${decimalPart}`));
    integerPart = formatNumber(integerPart);
    setValue(`${integerPart},${decimalPart}`);
  };

  useEffect(() => {
    inputRef.current.selectionStart = inputRef.current.selectionEnd = value.length;
  }, [value]);

  return (
    <input
      id={id}
      name={name}
      className='form-control'
      ref={inputRef}
      type="text"
      value={value}
      onClick={(e) => e.target.setSelectionRange(value.length, value.length)}
      onChange={handleInputChange}
    />
  );
};

export default DecimalInput;
