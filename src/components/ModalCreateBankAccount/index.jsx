import { useEffect, useRef, useState } from "react";
import { Alert, Modal } from "react-bootstrap";
import { getBanks } from "../../helpers/banks";
import { createBankAccount } from "../../helpers/banksAccounts";
import Select from "react-select";
import DecimalInput from "../DecimalInput";
import { getCurrencies } from "../../helpers/currencies";

const ModalCreateBankAccount = ({ modalShow, setModalShow }) => {
  const [alertType, setAlertType] = useState("danger");
  const [banks, setBanks] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const form = useRef();

  useEffect(() => {
    setLoading(true);
    Promise.all([getBanks(`paginated=no`), getCurrencies("paginated=no")])
      .then(([banksResponse, currenciesResponse]) => {
        setBanks(
          banksResponse.map((e) => ({
            label: `${e.name} - ${e.country.name} (${e.type.name})`,
            value: e.id,
          })),
        );
        setCurrencies(
          currenciesResponse.map(({ name, shortcode, id }) => ({
            label: name.concat(" (", shortcode, ")"),
            value: id,
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

  const handleBankAccount = async () => {
    setLoading(true);
    try {
      const formData = new FormData(form.current);
      formData.set(
        "balance",
        new Number(formData.get("balance").replace(/\D/g, "")) / 100,
      );
      const request = await createBankAccount(formData);

      switch (request.status) {
        case 201:
          setErrorMessage("Cuenta creada con éxito");
          setAlertType("success");

          window.location.reload();
          break;
        case 422:
          setErrorMessage(request.data.message);
          setAlertType("danger");
          break;

        default:
          setErrorMessage("Error en la creación de la cuenta");
          setAlertType("danger");
          break;
      }
    } catch (error) {
      setErrorMessage("Error en la creación de la cuenta");
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
                <span className="ModalTopTitle">
                  Registrar nueva cuenta bancaria
                </span>
                <span className="ModalTopSubTitle">
                  Esta pestaña le permite registrar una nueva cuenta bancaria o
                  de alguna otra plataforma monetaria.
                </span>
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
                  Nombre <span className="Required">*</span>
                </label>
                <input
                  required
                  className="form-control"
                  type="text"
                  name="name"
                  id="name"
                />
              </div>
              <div className="col">
                <label htmlFor="identifier" className="form-label">
                  Identificador <span className="Required">*</span>
                </label>
                <input
                  required
                  className="form-control"
                  type="text"
                  name="identifier"
                  id="identifier"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="bank" className="form-label">
                  Banco <span className="Required">*</span>
                </label>
                <Select
                  placeholder="Seleccione un banco"
                  noOptionsMessage={() => "No hay coincidencias"}
                  inputId="bank"
                  name="bank_id"
                  options={banks}
                />
              </div>
              <div className="col">
                <label htmlFor="currency_id" className="form-label">
                  Moneda <span className="Required">*</span>
                </label>
                <Select
                  placeholder="Seleccione una moneda"
                  noOptionsMessage={() => "No hay coincidencias"}
                  inputId="currency_id"
                  name="currency_id"
                  options={currencies}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <label htmlFor="balance" className="form-label">
                  Monto inicial <span className="Required">*</span>
                </label>
                <DecimalInput id="balance" name="balance" />
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
          onClick={handleBankAccount}
          className="btn btn-primary"
          disabled={loading}
        >
          Registrar cuenta
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCreateBankAccount;
