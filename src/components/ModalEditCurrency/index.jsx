import { useEffect, useRef, useState } from "react";
import { Alert, Modal } from "react-bootstrap";
import { updateCurrency } from "../../helpers/currencies";
import { getCountries } from "../../helpers/countries";
import Select from "react-select";

const ModalEditCurrency = ({ modalShow, setModalShow, currency }) => {
  const [countries, setCountries] = useState([]);
  const [alertType, setAlertType] = useState("danger");
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const form = useRef();

  useEffect(() => {
    setLoading(true);
    getCountries("paginated=no&order=name")
      .then((response) => {
        if (response)
          setCountries(
            response.data.map(({ name, shortcode, id }) => ({
              label: `${name} (${shortcode})`,
              value: id,
            })),
          );
      })
      .catch(({ message, error }) => {
        setErrorMessage(message);
        setAlertType("danger");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCurrency = async () => {
    setLoading(true);
    try {
      const formData = new FormData(form.current);
      const data = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }

      const request = await updateCurrency(currency.id, data);

      switch (request.status) {
        case 201:
          setErrorMessage("Moneda editada con éxito");
          setAlertType("success");

          window.location.reload();
          break;
        case 422:
          setErrorMessage(request.data.message);
          setAlertType("danger");
          break;

        default:
          setErrorMessage("Error en la edicion de la moneda");
          setAlertType("danger");
          break;
      }
    } catch (error) {
      setErrorMessage("Error en la edicion de la moneda");
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
                <span className="ModalTopTitle">Editar moneda</span>
                <span className="ModalTopSubTitle"></span>
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="FormContainer" action="" ref={form} autoComplete="off">
          <div className="container">
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="name" className="form-label">
                  Nombre de la moneda <span className="Required">*</span>
                </label>
                <input
                  defaultValue={currency.name}
                  required
                  className="form-control"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Dólar estadounidense"
                />
              </div>
              <div className="col">
                <label htmlFor="shortcode" className="form-label">
                  Código de la moneda <span className="Required">*</span>
                </label>
                <input
                  defaultValue={currency.shortcode}
                  required
                  className="form-control"
                  type="text"
                  id="shortcode"
                  name="shortcode"
                  placeholder="USD"
                />
              </div>
              <div className="col">
                <label htmlFor="symbol" className="form-label">
                  Símbolo de la moneda <span className="Required">*</span>
                </label>
                <input
                  defaultValue={currency.symbol}
                  required
                  className="form-control"
                  type="text"
                  id="symbol"
                  name="symbol"
                  placeholder="$"
                />
              </div>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="country" className="form-label">
                    País
                  </label>
                  <Select
                    inputId="country"
                    name="country_id"
                    options={countries}
                    defaultValue={{
                      label: `${currency.country.name} (${currency.country.shortcode})`,
                      value: currency.country.id,
                    }}
                    placeholder="Seleccione un país"
                    noOptionsMessage={() => "No hay coincidencias"}
                    isDisabled
                  />
                </div>
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
        <button
          onClick={handleCurrency}
          className="btn btn-primary"
          disabled={loading}
        >
          Editar moneda
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditCurrency;
