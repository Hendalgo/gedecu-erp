import { useContext } from "react";
import { SessionContext } from "../../../context/SessionContext";
import "./UserProfileButton.css";
import { useNavigate } from "react-router-dom";
import { USERS_ROUTE } from "../../../consts/Routes";

export default function UserProfileButton() {
  const { session } = useContext(SessionContext);
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(`${USERS_ROUTE}/profile`);
  }

  const words = session.name.split(" ").filter((name) => name);
  let firstLetters = words.at(0)[0];
  firstLetters += words.pop()[0];

  return (
    <div onClick={goToProfile} className="d-flex justify-content-end align-items-center UserProfileButton">
      {/* <img src="" alt="Avatar" width={32} height={32} className="me-3 rounded" /> */}
      <div className="UserProfileAvatar">
        {
          firstLetters.toUpperCase()
        }
      </div>
      <div>
        <p className="m-0 fw-semibold UserName">
          {
            session.name
          }
        </p>
        <p className="m-0 UserRole">
          {
            session.role.name
          }
        </p>
      </div>
    </div>
  );
}