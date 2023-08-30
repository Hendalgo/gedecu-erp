import { useContext, useState } from "react";
import { NavLink,Link } from "react-router-dom";
import './SideBar.css';
import { ReactSVG } from "react-svg";
import { SessionContext } from "../../context/SessionContext";

const SideBar = ({children}) => {
  const {setSession} = useContext(SessionContext);
  const Menus = [
    { title: "Escritorio", src: "home-blue-icon", link: "" },
    { title: "Reportes", src: "document-white-icon", link: "reports" },
    { title: "Locales", src: "map-marker-home", link: "stores" },
    { title: "Bancos ", src: "bank", link: "banks" },
    { title: "Usuarios", src: "user", link: "users" },
  ];
  return (
    <div className="container-fluid AppContainer" >
      <div className={`row`}>
        <div className="col-2 SideBarCol d-flex flex-column flex-shrink-0 p-3">
          <div className="d-flex pb-4 pt-3 align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <img
              src="/gedecu.png"
              className={`img-fluid bi pe-none me-2`}
            />
          </div>
          <ul className="nav nav-pills flex-column mb-auto">
            {Menus.map((Menu, index) => (
              <li
                key={index}
                className={`SideBarItem p-1`}
              >
                <NavLink 
                  className={`nav-link`}
                  to={Menu.link}
                >
                  <ReactSVG
                    className="bi me-2 "
                    wrapper="span"
                    src={`/${Menu.src}.svg`} 
                  />
                  {Menu.title}
                </NavLink>
              </li>
            ))}
          </ul>
          <div>
            <div className="pb-5 nav nav-pills flex-column mb-auto">
              <Link className="nav-link"  to="/" onClick={()=> setSession()}>
                <ReactSVG
                  className="bi me-2 "
                  wrapper="span"
                  src="/sign-in.svg"
                />
                Cerrar Sesión
              </Link>
            </div>
            <img src="logo-broders.png" alt="Logo broders" />
          </div>
        </div>
        <div className="col-10" style={{maxHeight: "100vh", overflowY: "scroll"}}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default SideBar;