import "./BankCard.css";
import useRandColor from "../../hooks/useRandColor";
import PropTypes from "prop-types";
const BankCard = ({ amount, currency, name }) => {
  return (
    <div className="d-flex align-items-center mb-2">
      <div>
        <span
          style={{
            backgroundColor: useRandColor(),
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
        <span className="BankName">{name}</span>
        <span className="BankAmount">
          {currency} {amount}
        </span>
      </div>
    </div>
  );
};
BankCard.propTypes = {
  amount: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default BankCard;
