import { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import BanksSelect from "../../../BanksSelect";
import { getUsers } from "../../../../helpers/users";
import Select from "react-select";
import { getBankAccounts } from "../../../../helpers/banksAccounts";
import DecimalInput from "../../../DecimalInput";

export default function SupplierOutcomeReportForm() {
    const [bank, setBank] = useState(null);
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [bankAccount, setBankAccount] = useState(null);
    const [bankAccounts, setBankAccounts] = useState([]);
    const { handleSubmit, setError, } = useContext(ReportTableContext);

    const handleBankChange = async (option) => {
        if (option?.value !== bank?.value) {
            setBank(option);
            setUser(null);
            setUsers([]);

            handleUserChange(null);

            if (option) {
                try {
                    const usersResponse = await getUsers(`paginated=no&bank=${option.value}`);

                    if (usersResponse) {
                        setUsers(usersResponse.data.map(({ name, email, id }) => {
                            const label = name.concat(" (", email, ")");
    
                            return { label: label, value: id };
                        }));
                    }
                } catch ({ message, error, }) {
                    setError({ show: true, message: [error.message], variant: "danger", });
                }
            }
        }
    }

    const handleUserChange = async (option) => {
        if (option?.value !== user?.value) {
            setUser(option);
            setBankAccount(null);
            setBankAccounts([]);

            if (option) {
                try {
                    const accountsResponse = await getBankAccounts(`paginated=no&country=2&user=${option.value}`);

                    if (accountsResponse) setBankAccounts(accountsResponse.map(({ name, identifier, bank, id, }) => {
                        const label = name.concat(" - ", identifier, " (", bank.name, ")");
                        return { label: label, value: id };
                    }));
                } catch ({ message, error, }) {
                    setError({ show: true, message: [error.message], variant: "danger", });
                }
            }
        }
    }

    const handleLocalSubmit = (ev) => {
        ev.preventDefault();
        let errors = [];

        try {
            const data = new FormData(ev.target);
    
            if (!bankAccount) errors.push("El campo Cuenta es obligatorio.");
            if (data.get("amount") === "0,00") errors.push("El campo Monto es obligatorio.");

            if (errors.length > 0) throw new Error(errors.join(";"));

            handleSubmit(data);
    
            ev.target.reset();
        } catch (error) {
            setError({ show: true, message: error.message.split(";"), variant: "danger", });
        }
    }

    const handleReset = () => {
        setBankAccount(null);
    }

    return (
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="bank_id" className="form-label">Banco</label>
                    <BanksSelect
                        id="bank"
                        name="bank"
                        query="&country=2"
                        value={bank}
                        onChange={handleBankChange}
                        onError={setError} />
                </div>
                <div className="col">
                    <label htmlFor="user" className="form-label">Gestor</label>
                    <Select
                        inputId="user"
                        name="user"
                        value={user}
                        options={users}
                        isDisabled={users.length === 0}
                        placeholder="Selecciona el gestor"
                        noOptionsMessage={() => "No hay coincidencias"}
                        onChange={handleUserChange}
                    />
                </div>
            </div>

            <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="account_id" className="form-label">Cuenta <span className="Required">*</span></label>
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
                    <input type="hidden" name="account" value={bankAccount?.label || ""} />
                    <div className="col">
                        <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                        <DecimalInput id="amount" name="amount" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-6">
                        <Form.Check type="checkbox" id="isDuplicated" name="isDuplicated" label="Duplicado" />
                    </div>
                </div>
                <div className="row">
                    <div className="col text-end">
                        <input type="submit" value="Agregar" className="btn btn-outline-primary" />
                    </div>
                </div>
            </form>
        </>
    );
}