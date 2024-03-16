import { useContext, useEffect, useState } from "react";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import BanksSelect from "../../../BanksSelect";
import { getUsers } from "../../../../helpers/users";
import Select from "react-select";
import { getBankAccounts } from "../../../../helpers/banksAccounts";
import AmountCurrencyInput from "../../../AmountCurrencyInput";
import DateInput from "../../../DateInput";
import { getDateString } from "../../../../utils/date";

export default function SupplierOutcomeReportForm() {
  const [bank, setBank] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [bankAccount, setBankAccount] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [date, setDate] = useState(getDateString());
  const { handleSubmit, setError, selected } = useContext(ReportTableContext);

  useEffect(() => {
    const setValues = async () => {
      if (selected) {
        const { data } = selected;
        setBank({
          value: parseInt(data.bank_id),
          label: data.bank,
        });
        await fetchUsers(data.bank_id);
        setUser({
          value: parseInt(data.user_id),
          label: data.user,
        });
        await fetchAccounts(data.user_id, data.bank_id);
        setBankAccount({
          value: parseInt(data.account_id),
          label: data.account,
          currency_id: parseInt(data.currency_id),
          currency: data.currency,
        });
        setDate(getDateString(new Date(data.date)));
      }
    }
    setValues();
  }, [selected]);

  const fetchUsers = async (bankId) => {
    try {
      const usersResponse = await getUsers(
        `paginated=no&bank=${bankId}`,
      );

      if (usersResponse) {
        setUsers(
          usersResponse.data.map(({ name, email, id }) => {
            const label = name.concat(" (", email, ")");

            return { label: label, value: id };
          }),
        );
      }
    } catch ({ message, error }) {
      setError({ show: true, message: [error.message], variant: "danger" });
    }
  };

  const fetchAccounts = async (userId, bankId) => {
    try {
      const accountsResponse = await getBankAccounts(
        `paginated=no&country=2&user=${userId}&bank=${bankId}`,
      );

      if (accountsResponse)
        setBankAccounts(
          accountsResponse.map(
            ({ name, identifier, bank, id, currency }) => {
              const label = name.concat(
                " - ",
                identifier,
                " (",
                bank.name,
                ")",
              );
              return {
                label: label,
                value: id,
                currency: currency.shortcode,
                currency_id: currency.id,
              };
            },
          ),
        );
    } catch ({ message, error }) {
      setError({ show: true, message: [error.message], variant: "danger" });
    }
  };

  const handleBankChange = async (option) => {
    if (option?.value !== bank?.value) {
      setBank(option);
      setUser(null);
      setUsers([]);

      handleUserChange(null);

      if (option) {
        await fetchUsers(option.value);
      }
    }
  };

  const handleUserChange = async (option) => {
    if (option?.value !== user?.value) {
      setUser(option);
      setBankAccount(null);
      setBankAccounts([]);

      if (option) {
        await fetchAccounts(option.value, bank.value);
      }
    }
  };

  const handleLocalSubmit = (ev) => {
    ev.preventDefault();
    let errors = [];

    try {
      const formData = new FormData(ev.target);

      if (!bankAccount) errors.push("El campo Cuenta es obligatorio.");
      if (formData.get("amount") === "0,00")
        errors.push("El campo Monto es obligatorio.");
      if (formData.get("date")) {
        const now = new Date(formData.get("date")).getTime();
        if (now > new Date().getTime()) {
          errors.push("La fecha es inválida.");
        }
      }
  
      if (errors.length > 0) throw new Error(errors.join(";"));

      handleSubmit(formData);

      ev.target.reset();
    } catch (error) {
      setError({
        show: true,
        message: error.message.split(";"),
        variant: "danger",
      });
    }
  };

  const handleReset = () => {
    setBankAccount(null);
    setDate(getDateString());
  };

  return (
    <>
      <form
        onSubmit={handleLocalSubmit}
        onReset={handleReset}
        autoComplete="off"
      >
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="bank_id" className="form-label">
              Banco
            </label>
            <BanksSelect
              id="bank"
              name="bank"
              query="&country=2"
              value={bank}
              onChange={handleBankChange}
              onError={setError}
            />
          </div>
          <div className="col">
            <label htmlFor="user_id" className="form-label">
              Gestor
            </label>
            <Select
              inputId="user_id"
              name="user_id"
              value={user}
              options={users}
              isDisabled={users.length === 0}
              placeholder="Selecciona el gestor"
              noOptionsMessage={() => "No hay coincidencias"}
              onChange={handleUserChange}
            />
            <input type="hidden" name="user" value={user?.label || ""} />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="account_id" className="form-label">
              Cuenta <span className="Required">*</span>
            </label>
            <Select
              inputId="account_id"
              name="account_id"
              value={bankAccount}
              options={bankAccounts}
              isDisabled={bankAccounts.length === 0}
              placeholder="Selecciona la cuenta"
              noOptionsMessage={() => "No hay coincidencias"}
              onChange={setBankAccount}
            />
          </div>
          <input
            type="hidden"
            name="account"
            value={bankAccount?.label || ""}
          />
          <div className="col">
            <label htmlFor="amount" className="form-label">
              Monto <span className="Required">*</span>
            </label>
            <AmountCurrencyInput
              defaultValue={selected ? parseFloat(selected.data.amount) : 0}
              currencySymbol={bankAccount?.currency || ""}
            />
          </div>
          <input
            type="hidden"
            name="currency_id"
            value={bankAccount?.currency_id || 0}
          />
          <input
            type="hidden"
            name="currency"
            value={bankAccount?.currency || ""}
          />
        </div>
        <div className="row mb-3">
          <div className="col-6">
            <DateInput value={date} onChange={setDate} />
          </div>
        </div>
        <div className="row">
          <div className="col text-end">
            <input
              type="submit"
              value="Agregar"
              className="btn btn-outline-primary"
            />
          </div>
        </div>
      </form>
    </>
  );
}
