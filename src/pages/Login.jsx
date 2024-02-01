import React, { useContext, useRef, useState } from "react";
import { Alert } from "react-bootstrap";
import { SessionContext } from "../context/SessionContext";
import "./Login.css";
import { login } from "../helpers/login";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState();
  const [inputPassType, setInputPassType] = useState("password");
  const { session, setSession } = useContext(SessionContext);
  const loginForm = useRef();
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setErrorMessage();
      const formData = new FormData(loginForm.current);
      const response = await login(formData);

      switch (response.status) {
        case 200:
          localStorage.setItem("token", response.data.access_token);
          window.location.reload();
          break;
        case 401:
          setErrorMessage(
            "Email o contraseña incorrectos. Verifique e intente de nuevo.",
          );
          break;
        case 422:
          setErrorMessage("Error email y contraseña son campos requeridos");
          break;
        case 500:
          setErrorMessage("Error de servidor, intente de nuevo mas tarde.");
        default:
          setErrorMessage("Error de servidor, intente de nuevo mas tarde.");
          break;
      }
    } catch (error) {
      setErrorMessage("Error de servidor, intente de nuevo mas tarde.");
    }
  };
  return (
    <div className="container-fluid">
      <div className="row" style={{ height: "100vh" }}>
        <div className="col-6 LoginLContainer">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "100%" }}
          >
            <img src="/login.png" alt="" />
          </div>
        </div>
        <div className="col-6 LoginRContainer">
          <div className="LoginR">
            <img className="img-fluid" src="/gedecu.png" alt="" width={150} />
            <div className="bg-white LoginFormContainer">
              <h5>Iniciar sesión</h5>
              <h6>¡Bienvenido de vuelta!</h6>
              <form ref={loginForm} onSubmit={handleSubmit} action="">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    autoComplete="true"
                    name="email"
                    typeof="email"
                    className="form-control"
                    placeholder="Tu correo"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Contraseña *
                  </label>
                  <div className="PasswordContainer">
                    <input
                      className="form-control"
                      name="password"
                      type={inputPassType}
                      placeholder="*********"
                    />

                    <div className="ViewPassword">
                      <label htmlFor="view-pass">Mostrar/Ocultar</label>
                      <input
                        name="view-pass"
                        type="checkbox"
                        onClick={(e) =>
                          inputPassType === "password"
                            ? setInputPassType("text")
                            : setInputPassType("password")
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  {errorMessage ? (
                    <Alert
                      variant="danger"
                      style={{ maxWidth: "100%", textAlign: "center" }}
                    >
                      {errorMessage}
                    </Alert>
                  ) : null}
                </div>
                <div className="d-grid mt-5">
                  <input
                    type="submit"
                    value="Iniciar sesión"
                    className="btn btn-primary"
                    style={{ backgroundColor: "var(--theme-primary, #0D6EFD)" }}
                  />
                </div>
              </form>
            </div>
            <div />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
