import { useRef, useState } from "react";
import { Alert, Modal } from "react-bootstrap";
import { updateCountry } from "../../helpers/countries";

const ModalEditCountry = ({ modalShow, setModalShow, country }) => {
  const [alertType, setAlertType] = useState("danger");
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const handleCountry = async () => {
    setLoading(true);
    try {
      const formData = new FormData(form.current);
      const data = {};

      for (const [key, val] of formData.entries()) {
        data[key] = val;
      }

      const request = await updateCountry(country.id, data);

      switch (request.status) {
        case 201:
          setErrorMessage("País editado con éxito");
          setAlertType("success");

          window.location.reload();
          break;
        case 422:
          setErrorMessage(request.data.message);
          setAlertType("danger");
          break;

        default:
          setErrorMessage("Error en la edicion del país");
          setAlertType("danger");
          break;
      }
    } catch (error) {
      setErrorMessage("Error en la edicion del país");
      setAlertType("danger");
    }
    setLoading(false);
  };
  return (
    <Modal show={modalShow} size="lg" onHide={() => setModalShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="container">
            <div className="row">
              <div className="d-flex flex-column">
                <span className="ModalTopTitle">Editar país</span>
                <span className="ModalTopSubTitle">
                  Esta pestaña le permite editar un nuevo país con su respectiva
                  moneda.
                </span>
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {country && (
          <form className="FormContainer" action="" ref={form}>
            <div className="container">
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="name" className="form-label">
                    Nombre del país <span className="Required">*</span>
                  </label>
                  <input
                    defaultValue={country.name}
                    required
                    className="form-control"
                    type="text"
                    id="name"
                    name="country_name"
                    placeholder="Venezuela"
                  />
                </div>
                <div className="col">
                  <label htmlFor="identifier" className="form-label">
                    Código del país <span className="Required">*</span>
                  </label>
                  <input
                    defaultValue={country.shortcode}
                    required
                    className="form-control"
                    type="text"
                    id="identifier"
                    name="country_shortcode"
                    placeholder="VE"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="locale" className="form-label">
                    Código local <span className="Required">*</span>
                  </label>
                  <input
                    defaultValue={country.locale}
                    required
                    className="form-control"
                    type="text"
                    id="locale"
                    name="locale"
                  />
                </div>
              </div>
            </div>
          </form>
        )}
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
          onClick={handleCountry}
          className="btn btn-primary"
          disabled={loading}
        >
          Editar país
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditCountry;
