import { useContext, useEffect, useRef, useState } from "react";
import { getBankAccounts } from "../../../../helpers/banksAccounts";
import Select from "react-select";
import DecimalInput from "../../../DecimalInput";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { Form } from "react-bootstrap";
import { SessionContext } from "../../../../context/SessionContext";

const TypeTwoTransferReportForm = () => {
  // Reporte de traspaso Tipo 2
  const [senderBankAccounts, setSenderBankAccounts] = useState([]);
  const [selectedSenderAccount, setSelectedSenderAccount] = useState(null);
  const [receiverBankAccounts, setReceiverBankAccounts] = useState([]);
  const [selectedReceiverAccount, setSelectedReceiverAccount] = useState(null);
  const bankAccounts = useRef([]);
  const { handleSubmit, setError, country } = useContext(ReportTableContext);
  const { session } = useContext(SessionContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [banksAccountsResponse] = await Promise.all([
          getBankAccounts(
            `paginated=no${country?.value ? `&country=${country?.value}` : ""}`,
          ),
        ]);

        if (banksAccountsResponse) {
          bankAccounts.current = banksAccountsResponse;

          const options = getOptions(banksAccountsResponse);

          setSenderBankAccounts(options);

          setReceiverBankAccounts(options);
        }
      } catch ({ response }) {
        setError({
          show: true,
          message: [response.data.message],
          danger: "danger",
        });
      }
    };
    fetchData();
  }, []);

  const getOptions = (optionsList = []) => {
    return optionsList.map(({ bank, identifier, currency, id }) => {
      return {
        label: bank.name.concat(" - ", identifier),
        value: id,
        currency_id: currency.id,
        currency: currency.shortcode,
      };
    });
  };

  const handleSenderAccountChange = (option) => {
    if (
      selectedReceiverAccount &&
      option &&
      selectedReceiverAccount.currency_id !== option.currency_id
    ) {
      setError({
        show: true,
        message: ["Las cuentas deben implementar la misma moneda."],
        variant: "danger",
      });
    } else {
      const newOptions = getOptions(
        bankAccounts.current.filter(({ id }) => id != option?.value || !option),
      );

      setReceiverBankAccounts(newOptions);

      setSelectedSenderAccount(option);
    }
  };

  const handleReceiverAccountChange = (option) => {
    if (
      selectedSenderAccount &&
      option &&
      selectedSenderAccount.currency_id !== option.currency_id
    ) {
      setError({
        show: true,
        message: ["Las cuentas deben implementar la misma moneda."],
        variant: "danger",
      });
    } else {
      const newOptions = getOptions(
        bankAccounts.current.filter(({ id }) => id != option?.value || !option),
      );

      setSenderBankAccounts(newOptions);

      setSelectedReceiverAccount(option);
    }
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let errors = [];

    try {
      if (!selectedSenderAccount)
        errors.push("El campo Cuenta emisora es obligatorio.");
      if (!selectedReceiverAccount)
        errors.push("El campo Cuenta receptora es obligatorio.");
      if (formData.get("amount") === "0,00")
        errors.push("El campo Monto es obligatorio.");

      if (
        selectedSenderAccount &&
        selectedReceiverAccount &&
        selectedSenderAccount.value === selectedReceiverAccount.value
      )
        errors.push("Las cuentas bancarias deben ser diferentes.");
      if (
        selectedSenderAccount &&
        selectedReceiverAccount &&
        selectedSenderAccount.currency_id !==
          selectedReceiverAccount.currency_id
      )
        errors.push("Las cuentas deben implementar la misma moneda.");

      if (errors.length > 0) throw new Error(errors.join(";"));

      handleSubmit(formData);

      e.target.reset();
    } catch (error) {
      setError({
        show: true,
        message: error.message.split(";"),
        variant: "danger",
      });
    }
  };

  const handleReset = () => {
    setSelectedReceiverAccount(null);
    setSelectedSenderAccount(null);
    setSenderBankAccounts(getOptions(bankAccounts.current));
    setReceiverBankAccounts(getOptions(bankAccounts.current));
  };

  return (
    <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
      <div className="row mb-3">
        <div className="col">
          <input
            type="hidden"
            id="senderAccount"
            name="senderAccount"
            value={selectedSenderAccount?.label || ""}
          />
          <label htmlFor="senderAccount_id" className="form-label">
            Cuenta emisora <span className="Required">*</span>
          </label>
          <Select
            inputId="senderAccount_id"
            name="senderAccount_id"
            options={senderBankAccounts}
            value={selectedSenderAccount}
            placeholder="Selecciona la cuenta emisora"
            noOptionsMessage={() => "No hay coincidencias"}
            onChange={(event) => handleSenderAccountChange(event)}
            isClearable
          />
        </div>
        <div className="col">
          <input
            type="hidden"
            id="receiverAccount"
            name="receiverAccount"
            value={selectedReceiverAccount?.label || ""}
          />
          <label htmlFor="receiverAccount_id" className="form-label">
            Cuenta receptora <span className="Required">*</span>
          </label>
          <Select
            inputId="receiverAccount_id"
            name="receiverAccount_id"
            options={receiverBankAccounts}
            value={selectedReceiverAccount}
            placeholder="Selecciona la cuenta receptora"
            noOptionsMessage={() => "No hay coincidencias"}
            onChange={(event) => handleReceiverAccountChange(event)}
            isClearable
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="amount" className="form-label">
            Monto <span className="Required">*</span>
          </label>
          <DecimalInput id="amount" name="amount" />
        </div>
      </div>
      <input
        type="hidden"
        name="currency_id"
        value={selectedSenderAccount?.currency_id || 0}
      />
      <input
        type="hidden"
        name="currency"
        value={selectedSenderAccount?.currency || ""}
      />
      <div className="row mb-3">
        <div className="col-6">
          <Form.Check id="isDuplicated" name="isDuplicated" label="Duplicado" />
        </div>
      </div>
      <div className="row text-end">
        <div className="col">
          <button type="submit" className="btn btn-outline-primary">
            Agregar
          </button>
        </div>
      </div>
    </form>
  );
};

export default TypeTwoTransferReportForm;
