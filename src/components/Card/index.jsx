import { ReactSVG } from "react-svg";
import "./Card.css";
import PropTypes from "prop-types";
import { formatAmount } from "../../utils/amount";

const Card = ({
  country = "",
  currency,
  total,
  percent,
  img = "/world.svg",
  moneyType = "Cuenta",
  currencySymbol = "$",
  showPercent = true,
}) => {
  return (
    <div className="bg-white CardContainer">
      <div className="px-4 pt-4 pb-2 d-flex justify-content-between">
        <div>
          <div className="CurrencyName mb-1" style={{ textWrap: "nowrap" }}>
            {`${currency} - ${moneyType}`}
          </div>
          <p className="TotalCard m-0">
            {`${currencySymbol} ${formatAmount(total)}`}
          </p>
        </div>
        <div className="ms-5 CardIcon">
          <img src={img} alt={currency} />
        </div>
      </div>
      {showPercent && (
        <div className="pb-4 px-4">
          {percent >= 0 ? (
            <ReactSVG src="/up.svg" wrapper="span" />
          ) : (
            <ReactSVG src="/down.svg" wrapper="span" />
          )}
          <span>{formatAmount(percent)}% día de hoy</span>
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  country: PropTypes.string,
  currency: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  percent: PropTypes.number,
  img: PropTypes.string,
  moneyType: PropTypes.string,
  currencySymbol: PropTypes.string,
};

export default Card;
