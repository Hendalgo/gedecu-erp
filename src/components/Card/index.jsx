import { ReactSVG } from "react-svg";
import "./Card.css";
import PropTypes from "prop-types";
import { formatAmount } from "../../utils/amount";

const Card = ({ country = "", currency, total, percent, img = "/world.svg" }) => {
  return (
    <div className="bg-white CardContainer">
      <div className="px-4 pt-4 pb-3 d-flex justify-content-between">
        <div>
          {/* <div className="CountryName pb-1" style={{ textWrap: "nowrap" }}>
            <ReactSVG src="/world.svg" className="me-2" wrapper="span" />
            {country}
          </div> */}
          <div className="TotalCard" style={{ textWrap: "nowrap" }}>
            {`${currency} ${formatAmount(total)}`}
          </div>
        </div>
        <div className="ms-5 CardIcon">
          <img src={img} alt={currency} />
        </div>
      </div>
      {/* <div className="pb-4 px-4">
        {percent >= 0 ? (
          <ReactSVG src="/up.svg" wrapper="span" />
        ) : (
          <ReactSVG src="/down.svg" wrapper="span" />
        )}
        <span>{percent.toFixed(2)}% día de hoy</span>
      </div> */}
    </div>
  );
};

Card.propTypes = {
  country: PropTypes.string,
  currency: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  percent: PropTypes.number,
  img: PropTypes.string,
};

export default Card;
