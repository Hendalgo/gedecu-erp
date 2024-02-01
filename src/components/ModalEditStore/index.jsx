import { useEffect, useRef, useState } from "react";
import { Alert, Modal } from "react-bootstrap";
import { getCountriesCount } from "../../helpers/banks";
import { getUsers } from "../../helpers/users";
import { updateStore } from "../../helpers/stores";
import Select from "react-select";

const ModalEditStore = ({ modalShow, setModalShow, store }) => {
  const [countries, setCountries] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [users, setUsers] = useState([]);
  const [alertType, setAlertType] = useState("danger");
  const [loading, setLoading] = useState(false);
  const form = useRef();

  useEffect(() => {
    setLoading(true);
    Promise.all([getCountriesCount(), getUsers(`paginated=no&role=3`)])
      .then(([countriesResponse, usersResponse]) => {
        setCountries(
          countriesResponse.map(({ name, id }) => ({ label: name, value: id })),
        );
        setUsers(
          usersResponse.data.map((e) => ({
            label: `${e.name} - ${e.email}`,
            value: e.id,
          })),
        );
      })
      .catch(({ error, message }) => {
        setErrorMessage(error.message);
        setAlertType("danger");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleStore = async () => {
    setLoading(true);
    try {
      const formData = new FormData(form.current);
      const data = {};

      for (const [key, val] of formData.entries()) {
        data[key] = val.trim();
      }

      const request = await updateStore(store.id, data);

      switch (request.status) {
        case 201:
          setErrorMessage("Local actualizado con éxito");
          setAlertType("success");

          window.location.reload();
          break;
        case 422:
          setErrorMessage(request.data.message);
          setAlertType("danger");
          break;

        default:
          setErrorMessage("Error actualizando el local");
          setAlertType("danger");
          break;
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Error actualizando el local");
      setAlertType("danger");
    }
    setLoading(false);
  };

  return store ? (
    <Modal show={modalShow} size="lg" onHide={() => setModalShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="container">
            <div className="row">
              <div className="d-flex flex-column">
                <span className="ModalTopTitle">Editar local</span>
                <span className="ModalTopSubTitle">
                  Esta pestaña le permite editar un local existente
                </span>
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="container" action="" ref={form}>
          <div className="row mb-3">
            <div className=" col ">
              <label htmlFor="name" className="form-label">
                Nombre <span className="Required">*</span>
              </label>
              <input
                defaultValue={store.name}
                required
                className="form-control"
                type="text"
                name="name"
                id="name"
              />
            </div>
            <div className="col">
              <label htmlFor="location" className="form-label">
                Dirección <span className="Required">*</span>
              </label>
              <input
                defaultValue={store.location}
                required
                className="form-control"
                type="text"
                name="location"
                id="location"
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="country_id" className="form-label">
                País <span className="Required">*</span>
              </label>
              <Select
                isDisabled
                inputId="country_id"
                name="country_id"
                options={countries}
                defaultValue={{
                  label: store.country.name,
                  value: store.country.id,
                }}
              />
            </div>
            <div className="col ">
              <label htmlFor="user_id" className="form-label">
                Manejador <span className="Required">*</span>
              </label>
              <Select
                inputId={"user_id"}
                name={"user_id"}
                placeholder="Seleccione un manejador"
                noOptionsMessage={() => "No hay coincidencias"}
                options={users}
                defaultValue={
                  store.user
                    ? {
                        label: `${store.user.name} - ${store.user.email}`,
                        value: store.user.id,
                      }
                    : null
                }
              />
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
        <button
          onClick={handleStore}
          className="btn btn-primary"
          disabled={loading}
        >
          Editar local
        </button>
      </Modal.Footer>
    </Modal>
  ) : null;
};

export default ModalEditStore;
