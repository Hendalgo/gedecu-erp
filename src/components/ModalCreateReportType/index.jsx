import { useRef, useState } from "react";
import { Alert, Modal } from "react-bootstrap";
import Select from "react-select";
import { createReportTypes } from "../../helpers/reports";

const ModalCreateReportType = ({ modalShow, setModalShow }) => {
  const [alertType, setAlertType] = useState("danger");
  const [errorMessage, setErrorMessage] = useState();
  const form = useRef();
  const handleBankAccount = async () => {
    try {
      const formData = form.current;
      const request = await createReportTypes(formData);
      switch (request.status) {
        case 201:
          setErrorMessage("Tipo creado con éxito");
          setAlertType("success");

          window.location.reload();
          break;
        case 422:
          setErrorMessage(request.data.message);
          setAlertType("danger");
          break;

        default:
          setErrorMessage("Error en la creación del tipo");
          setAlertType("danger");
          break;
      }
    } catch (error) {
      setErrorMessage("Error en la creación del tipo");
      setAlertType("danger");
    }
  };
  return (
    <Modal show={modalShow} size="lg" onHide={() => setModalShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="container">
            <div className="row">
              <div className="d-flex flex-column">
                <span className="ModalTopTitle">
                  Crear nuevo tipo de reporte
                </span>
                <span className="ModalTopSubTitle">
                  Esta pestaña le permite crear un nuevo tipo de reporte
                </span>
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="FormContainer" action="" ref={form}>
          <div className="container">
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="name" className="form-label">
                  Nombre <span className="Required">*</span>
                </label>
                <input
                  required
                  className="form-control"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="E.j: Tranferencia enviada"
                />
              </div>
              <div className="col">
                <label htmlFor="type" className="form-label">
                  Tipo <span className="Required">*</span>
                </label>
                <Select
                  placeholder="Selecciona un tipo"
                  name="type"
                  options={[
                    {
                      label: "Ingreso",
                      value: "income",
                    },
                    {
                      label: "Egreso",
                      value: "expense",
                    },
                    {
                      label: "Neutro",
                      value: "neutro",
                    },
                  ]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="description" className="form-label">
                  Descripción
                </label>
                <textarea
                  defaultValue=""
                  name="description"
                  id=""
                  className="form-control"
                ></textarea>
              </div>
            </div>
          </div>
        </form>
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
        <button onClick={handleBankAccount} className="btn btn-primary">
          Crear tipo
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCreateReportType;
