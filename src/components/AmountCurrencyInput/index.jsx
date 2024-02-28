import DecimalInput from "../DecimalInput";

export default function AmountCurrencyInput({
    currencySymbol = "",
    onChange = () => null,
}) {
  return (
    <div className="input-group">
      <span className="input-group-text">{currencySymbol}</span>
      <DecimalInput id="amount" name="amount" onChange={onChange} />
    </div>
  );
}