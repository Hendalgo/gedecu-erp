import React from "react";
import { ReactSVG } from "react-svg";
const DownloadButton = () => {
  return (
    <button className="DownloadButton">
      <ReactSVG src="/download.svg" wrapper="span" className="DownloadIcon" />
      Descargar
    </button>
  );
};

export default DownloadButton;
