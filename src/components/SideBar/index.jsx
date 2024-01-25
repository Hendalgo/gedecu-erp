import { useContext, useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import './SideBar.css'
import { ReactSVG } from 'react-svg'
import { SessionContext } from '../../context/SessionContext'
import { Accordion } from 'react-bootstrap'
import { logout } from '../../helpers/logout'
import { AdminMenus, NormalUserMenu } from '../../consts/Menus'
import { useCheckRole } from '../../hooks/useCheckRole'
import useScreenSize from '../../hooks/useScreenSize'
import { getStores } from '../../helpers/stores'

const SideBar = ({ children }) => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(AdminMenus);
  const {width, maxHeight} = useScreenSize() 
  let menus = [];
  const {session, setSession } = useContext(SessionContext)

  if (useCheckRole(session)) {
    menus = AdminMenus;
  }
  else{
    menus = NormalUserMenu(session);
  }
  return width > 1440 
    ?<SideBarBig menus={menus} setSession={setSession} isActive={isActive}>{children}</SideBarBig>
    :<SideBarSmall menus={menus} setSession={setSession} isActive={isActive}>{children}</SideBarSmall>
}
const SideBarSmall = ({menus, setSession, children}) =>{
  const location = useLocation();
  const [isActive, setIsActive] = useState(menus);
  useEffect(() => {
    setIsActive(
      menus.map( e=>  {
        if (window.location.pathname.startsWith("/dashboard/"+e.link)){
          e.isActive = true;
        }
        else{
          e.isActive = false;
        }
        return e;
      })
    )
  }, [location, menus]);
  return (
  <div className='container-fluid AppContainer'>
    <div className='row'>
      <div className='col-3 SideBarCol d-flex flex-column flex-shrink-0 p-3'>
        <div className='d-flex pb-4 pt-3 align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none'>
          <img
            src='/gedecu.png'
            className='img-fluid bi pe-none me-2'
          />
        </div>
        <ul className='nav nav-pills flex-column mb-auto'>
          {isActive.map((Menu, index) => (
            <li
              key={index}
              className='SideBarItem p-1'
            >
              {
                !Menu.others
                  ? <NavLink
                      className='nav-link'
                      to={Menu.link}
                    >
                    <ReactSVG
                      className='bi me-2 '
                      wrapper='span'
                      src={`/${Menu.src}.svg`}
                    />
                    {Menu.title}
                  </NavLink>
                  : <Accordion>
                    <Accordion.Item eventKey={index} className={Menu.isActive ? "active" : ""}>
                      <Accordion.Header>
                        <NavLink

                          className='nav-link'
                          to={Menu.link}
                        >
                          <ReactSVG
                            className='bi me-2 '
                            wrapper='span'
                            src={`/${Menu.src}.svg`}
                          />
                          {Menu.title}
                        </NavLink>
                      </Accordion.Header>
                      <Accordion.Body>
                        {
                        Menu.others.map((e, index) =>
                          <NavLink
                            className='nav-link'
                            to={e.link}
                            key={index}
                          >
                            {e.name}
                          </NavLink>
                        )
                      }
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
              }
            </li>
          ))}
        </ul>
        <div>
          <div className='pb-5 nav nav-pills flex-column mb-auto'>
            <Link className='nav-link' onClick={() => logout().then().finally(() => setSession(false))}>
              <ReactSVG
                className='bi me-2 '
                wrapper='span'
                src='/sign-in.svg'
              />
              Cerrar Sesión
            </Link>
          </div>
          <img src='/logo-broders.png' alt='Logo broders' />
        </div>
      </div>
      <div className='col-9' style={{ maxHeight: '100vh', overflowY: 'scroll' }}>
        {children}
      </div>
    </div>
  </div>
  )
}
const SideBarBig = ({menus, setSession, children})=>{
  
  const location = useLocation();
  const [isActive, setIsActive] = useState(menus);
  useEffect(() => {
    setIsActive(
      menus.map( e=>  {
        if (window.location.pathname.startsWith("/dashboard/"+e.link)){
          e.isActive = true;
        }
        else{
          e.isActive = false;
        }
        return e;
      })
    )
  }, [location, menus]);
  return (
    <div className='container-fluid AppContainer'>
      <div className='row'>
        <div className='col-2 SideBarCol d-flex flex-column flex-shrink-0 p-3'>
          <div className='d-flex pb-4 pt-3 align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none'>
            <img
              src='/gedecu.png'
              className='img-fluid bi pe-none me-2'
            />
          </div>
          <ul className='nav nav-pills flex-column mb-auto'>
            {isActive.map((Menu, index) => (
              <li
                key={index}
                className='SideBarItem p-1'
              >
                {
                  !Menu.others
                    ? <NavLink
                        className='nav-link'
                        to={Menu.link}
                      >
                      <ReactSVG
                        className='bi me-2 '
                        wrapper='span'
                        src={`/${Menu.src}.svg`}
                      />
                      {Menu.title}
                    </NavLink>
                    : <Accordion>
                      <Accordion.Item className={Menu.isActive ? "active" : ""} eventKey={index}>
                        <Accordion.Header>
                          <NavLink

                            className='nav-link'
                            to={Menu.link}
                          >
                            <ReactSVG
                              className='bi me-2 '
                              wrapper='span'
                              src={`/${Menu.src}.svg`}
                            />
                            {Menu.title}
                          </NavLink>
                        </Accordion.Header>
                        <Accordion.Body>
                          {
                          Menu.others.map((e, index) =>
                            <NavLink
                              className='nav-link'
                              to={e.link}
                              key={index}
                            >
                              {e.name}
                            </NavLink>
                          )
                        }
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                }
              </li>
            ))}
          </ul>
          <div>
            <div className='pb-5 nav nav-pills flex-column mb-auto'>
              <Link className='nav-link' onClick={() => logout().then().finally(() => setSession(false))}>
                <ReactSVG
                  className='bi me-2 '
                  wrapper='span'
                  src='/sign-in.svg'
                />
                Cerrar Sesión
              </Link>
            </div>
            <img src='/logo-broders.png' alt='Logo broders' />
          </div>
        </div>
        <div className='col-10' style={{ maxHeight: '100vh', overflowY: 'scroll' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
export default SideBar
