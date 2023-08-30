import React, { useContext, useEffect, useRef } from 'react'
import { SessionContext } from '../context/SessionContext'
import "./Login.css"
import { Navigate } from 'react-router-dom'
import {DASHBOARD_ROUTE} from "../consts/Routes"

const Login = () => {
  const {session, setSession} = useContext(SessionContext);

  const handleSubmit = (event) =>{
    event.preventDefault();
    window.localStorage.setItem("session", JSON.stringify({
      name: "Marcos",
      token: "",
      permission: 1,
      permissionTitle: "Administrador"
    }));
    location.reload();
  }
  return (
    <div className="container-fluid">
      <div className="row" style={{height: "100vh"}}>
        <div className="col-6 LoginLContainer" >
          <div className="d-flex align-items-center justify-content-center" style={{height: "100%"}}>
            <img src="/login.png" alt="" />
          </div>
        </div>
        <div className="col-6 LoginRContainer">
          <div className="LoginR">
              <img className='img-fluid' src="/gedecu.png" alt="" width={150} />
              <div className="bg-white LoginFormContainer">
                <h5>Iniciar sesión</h5>
                <h6>¡Bienvenido de vuelta!</h6>
                <form onSubmit={handleSubmit} action="">
                  <div className="mb-3">  
                    <label htmlFor="email" className='form-label'>Correo electrónico *</label>
                    <input type="email" typeof='email' className='form-control' placeholder='Tu correo'/>
                  </div>
                  <div className="mb-3">
                    <label className='form-label' htmlFor="password">Contraseña *</label>
                    <input  className='form-control' typeof='password' placeholder='*********'/>
                  </div>
                  <div className="d-grid mt-5">
                    <input type="submit" value="Iniciar sesión" className='btn btn-primary' style={{backgroundColor: "var(--theme-primary, #0D6EFD)"}}/>
                  </div>
                </form>
              </div>
              <div></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login