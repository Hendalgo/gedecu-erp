import DecimalInput from "../DecimalInput";

export default function RateCalcInput({
    message = "",
    disableButton = false,
    onClick = () => null,
    onChange = () => null,
}) {
    return (
        <>
            <div className="input-group">
                <button type="button" onClick={onClick} disabled={disableButton} tabIndex={-1} className="btn btn-secondary z-0">Ch</button>
                <DecimalInput name="rate" id="rate" onChange={onChange} />
            </div>
            <small className="fst-italic">{message}</small>
        </>
    );
}