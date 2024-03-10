import { useEffect, useRef } from "react";

const NumberInput = ({ id = "", name = "", defaultValue = 1 }) => {
  const input = useRef(null);

  const handleClick = () => {
    const currentValue = new Number(input.current.value);
    input.current.value = currentValue + 1;
  };

  useEffect(() => {
    input.current.value = defaultValue;
  }, [defaultValue]);

  return (
    <div className="input-group">
      <button
        type="button"
        className="btn btn-secondary z-0"
        onClick={handleClick}
      >
        +
      </button>
      <input
        type="number"
        ref={input}
        id={id}
        name={name}
        defaultValue={defaultValue}
        min={1}
        className="form-control"
      />
    </div>
  );
};

export default NumberInput;
