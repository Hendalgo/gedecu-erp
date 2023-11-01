import { useContext, useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import './SideBar.css'
import { ReactSVG } from 'react-svg'
import { SessionContext } from '../../context/SessionContext'
import { Accordion } from 'react-bootstrap'
import { REPORTS_ROUTE} from '../../consts/Routes'
import { logout } from '../../helpers/logout'
import { AdminMenus, NormalUserMenu } from '../../consts/Menus'
import { useCheckRole } from '../../hooks/useCheckRole'
import useScreenSize from '../../hooks/useScreenSize'

const SideBar = ({ children }) => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(window.location.pathname.startsWith(REPORTS_ROUTE));
  const {width, maxHeight} = useScreenSize() 
  let menus = [];
  useEffect(() => {
    setIsActive(location.pathname.startsWith('/dashboard/'+REPORTS_ROUTE));
  }, [location]);
  const {session, setSession } = useContext(SessionContext)
  if (useCheckRole(session)) {
    menus = AdminMenus;
  }
  else{
    menus = NormalUserMenu;
  }
  return width > 1440 
    ?<SideBarBig menus={menus} setSession={setSession} isActive={isActive}>{children}</SideBarBig>
    :<SideBarSmall menus={menus} setSession={setSession} isActive={isActive}>{children}</SideBarSmall>
}
const SideBarSmall = ({menus, setSession, isActive, children}) =>{return (
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
          {menus.map((Menu, index) => (
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
                    <Accordion.Item className={isActive ? "active" : ""}>
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
          <li className='SideBarItem p-1' style={{opacity: 0.5, textWrap:'nowrap'}}>
            <a href='#' className='nav-link'>
              <ReactSVG 
                className='bi me-2 '
                wrapper='span'
                src={`/world.svg`}
              />
                Países (próximamente)
            </a>
          </li>
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
const SideBarBig = ({menus, setSession, isActive, children})=>{
  
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
            {menus.map((Menu, index) => (
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
                      <Accordion.Item className={isActive ? "active" : ""}>
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
