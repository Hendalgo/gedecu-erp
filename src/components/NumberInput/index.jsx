import { useRef, } from "react";

const NumberInput = ({
    id = "",
    name = "",
}) => {
    const input = useRef(null);

    const handleClick = () => {
        const currentValue = new Number(input.current.value);
        input.current.value = currentValue + 1;
    }

    return (
        <div className="input-group">
            <button type="button" className="btn btn-secondary z-0" onClick={handleClick}>+</button>
            <input type="number" ref={input} id={id} name={name} defaultValue={1} min={1} className="form-control" />
        </div>
    )
}

export default NumberInput;