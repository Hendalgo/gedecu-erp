import { useEffect, useRef } from 'react';

const DecimalInput = ({ defaultValue = '0,00', name, id = "", onChange = () => null, readOnly = false, }) => {
  const inputRef = useRef();
  const prevNumber = useRef("0,00");

  const handleInputChange = (e) => {
    let { value } = e.target;

    value = value.replace(/[.,]/gi, '');

    if (value.match(/\D/gi)) {
      e.target.value = prevNumber.current;
    } else {
      const number = new Number(value) / 100;

      onChange(number);

      e.target.value = number.toLocaleString("es-VE", {
        useGrouping: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      prevNumber.current = e.target.value;
    }
  };

  useEffect(() => {
    inputRef.current.selectionStart = inputRef.current.selectionEnd = prevNumber.current.length;
  }, [prevNumber]);

  return (
    <input
      id={id}
      name={name}
      className='form-control'
      ref={inputRef}
      type="text"
      defaultValue={defaultValue}
      onClick={({ target }) => target.setSelectionRange(target.value.length, target.value.length)}
      onChange={handleInputChange}
      readOnly={readOnly}
    />
  );
};

export default DecimalInput;
