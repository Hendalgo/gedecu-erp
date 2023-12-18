import { useState } from "react";

const NumberInput = ({
    id = "",
    name = "",
}) => {
    const [number, setNumber] = useState(1);

    const handleNumberChange = ({ target }) => {
        setNumber(parseInt(target.value));
    }

    return (
        <div className="input-group">
            <button type="button" className="btn btn-secondary" onClick={() => setNumber((prev) => prev + 1)}>+</button>
            <input type="number" id={id} name={name} value={number} min={1} onChange={handleNumberChange} className="form-control" />
        </div>
    )
}

export default NumberInput;