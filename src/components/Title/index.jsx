import React, { useEffect } from "react";
import { ReactSVG } from "react-svg";
import { OverlayTrigger } from "react-bootstrap";
import "./Title.css";

const Title = ({ title, icon, description }) => {
  return (
    <div className="d-flex align-items-center">
      <ReactSVG src={icon} wrapper="span" className="TitleIcon pe-2" />
      <h6 className="d-flex align-items-center pe-2">{title}</h6>
      <OverlayTrigger
        placement="top"
        overlay={<span className="tooltip">{description}</span>}
      >
        <ReactSVG src="/info.svg" wrapper="span" />
      </OverlayTrigger>
    </div>
  );
};

export default Title;
