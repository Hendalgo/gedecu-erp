import { useRef, useState } from "react";
import { Alert, Modal } from "react-bootstrap";
import { updateUser } from "../../helpers/users";

const ModalEditUser = ({ modalShow, setModalShow, user, setUser }) => {
  const [alertType, setAlertType] = useState("danger");
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const handleUser = async () => {
    setLoading(true);
    try {
      const formData = new FormData(form.current);
      let userUpdate;
      if (form.current.password.value === "") {
        userUpdate = {
          name: user.name,
          email: user.email,
        };
      } else {
        userUpdate = {
          name: user.name,
          email: user.email,
          password: form.current.password.value,
          password_confirmation: form.current.password_confirmation.value,
        };
      }
      userUpdate["country_id"] = user.country_id;
      userUpdate["role_id"] = user.role_id;
      const request = await updateUser(user.id, userUpdate);

      switch (request.status) {
      case 201:
        setErrorMessage("Usuario actualizado con éxito");
        setAlertType("success");

        window.location.reload();
        break;
      case 422:
        setErrorMessage(request.data.message);
        setAlertType("danger");
        break;

      default:
        setErrorMessage("Error actualizando el usuario");
        setAlertType("danger");
        break;
      }
    } catch (error) {
      setErrorMessage("Error actualizando el usuario");
      setAlertType("danger");
    }
    setLoading(false);
  };

  return user ? (
    <Modal show={modalShow} size="lg" onHide={() => setModalShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="container">
            <div className="row">
              <div className="d-flex flex-column">
                <span className="ModalTopTitle">Editar usuario</span>
                <span className="ModalTopSubTitle">
                  Esta pestaña le permite editar un usuario existente
                </span>
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="d-flex">
              <form className="FormContainer" action="" ref={form}>
                <div className="d-flex mb-3">
                  <div className="me-4">
                    <label htmlFor="name">
                      Nombre <span className="Required">*</span>
                    </label>
                    <input
                      required
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                      className="form-control"
                      type="text"
                      id="name"
                      name="name"
                      value={user.name}
                    />
                  </div>
                  <div>
                    <label htmlFor="email">
                      Email <span className="Required">*</span>
                    </label>
                    <input
                      readOnly
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      className="form-control"
                      type="email"
                      id="email"
                      name="email"
                      value={user.email}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="password">Contraseña </label>
                  <input
                    required
                    id="password"
                    name="password"
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    className="form-control"
                    type="password"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirm-password">Confirmar Contraseña</label>
                  <input
                    required
                    id="confirm-password"
                    name="password_confirmation"
                    onChange={(e) =>
                      setUser({
                        ...user,
                        password_confirmation: e.target.value,
                      })
                    }
                    className="form-control"
                    type="password"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {errorMessage ? (
          <Alert
            variant={alertType}
            style={{ maxWidth: "100%", textAlign: "center" }}
          >
            {errorMessage}
          </Alert>
        ) : null}
        <button
          onClick={handleUser}
          className="btn btn-primary"
          disabled={loading}
        >
          Editar Usuario
        </button>
      </Modal.Footer>
    </Modal>
  ) : null;
};

export default ModalEditUser;
