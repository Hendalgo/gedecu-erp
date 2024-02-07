import "./BankCard.css";
import useRandColor from "../../hooks/useRandColor";
import PropTypes from "prop-types";
import { formatAmount } from "../../utils/amount";

const BankCard = ({ total, currency, shortcode, name, bank }) => {
  const backgroundColor = useRandColor();

  return (
    <div className="d-flex align-items-center mb-2">
      <div>
        <span
          style={{
            backgroundColor,
            height: 40,
            width: 40,
            display: "block",
            borderRadius: 4,
          }}
          className="BankImage img-fluid"
        >
          {" "}
        </span>
      </div>
      <div className="d-flex flex-column">
        <span className="BankName">{bank.name}</span>
        <span className="BankAmount">
          {currency || shortcode} {formatAmount(total)}
        </span>
      </div>
    </div>
  );
};

BankCard.propTypes = {
  total: PropTypes.number.isRequired,
  currency: PropTypes.object,
  currency: PropTypes.string,
  shortcode: PropTypes.string,
  bank: PropTypes.object.isRequired,
};

export default BankCard;
