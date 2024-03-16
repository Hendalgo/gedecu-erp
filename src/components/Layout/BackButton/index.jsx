import { useNavigate } from "react-router-dom";
import "./BackButton.css";
import { ReactSVG } from "react-svg";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button className="btn button" onClick={() => navigate(-1)}>
      <ReactSVG wrapper="span" src="/down.svg" />
    </button>
  );
}