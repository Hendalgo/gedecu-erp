import { ReactSVG } from "react-svg";
import "./AddButton.css";
import PropTypes from "prop-types";

// Add is the action should do the button on click
const AddButton = ({ text = "reporte", add }) => {
  return (
    <button
      onClick={add}
      className="d-sm-flex align-items-center bg-white AddButtonContainer"
    >
      <ReactSVG
        src="/plus.svg"
        className="AddButtonIconContainer"
        wrapper="span"
      />
      <div className="d-sm-flex flex-column ps-3 AddButtonTextContainer">
        <span>Nuevo</span>
        <span className="AddText">{text}</span>
      </div>
    </button>
  );
};
AddButton.propTypes = {
  text: PropTypes.string,
  add: PropTypes.func.isRequired,
};
export default AddButton;
