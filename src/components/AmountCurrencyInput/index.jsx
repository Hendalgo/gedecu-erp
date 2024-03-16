import { formatAmount } from "../../utils/amount";
import DecimalInput from "../DecimalInput";

export default function AmountCurrencyInput({
    currencySymbol = "",
    defaultValue = 0,
    onChange = () => null,
}) {

  defaultValue = formatAmount(defaultValue);

  return (
    <div className="input-group">
      <span className="input-group-text">{currencySymbol}</span>
      <DecimalInput id="amount" name="amount" defaultValue={defaultValue} onChange={onChange} />
    </div>
  );
}