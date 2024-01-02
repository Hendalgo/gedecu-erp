import Select from "react-select";
import DecimalInput from "../../../DecimalInput";
import { useContext, useState } from "react";
import { getBankAccounts } from "../../../../helpers/banksAccounts";
import { Form } from "react-bootstrap";
import { ReportTableContext } from "../../../../context/ReportTableContext";
import { SessionContext } from "../../../../context/SessionContext";

const TypeTwoWalletAccountReportForm = () => {
    const [bankAccounts, setBankAccounts] = useState([]);
    const [bankAccount, setBankAccount] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState({label: "Efectivo", value: 1});
    const { handleSubmit, setError, country, } = useContext(ReportTableContext);
    const { session } = useContext(SessionContext);

    const handlePaymentMethodChange = async (option) => {
        if (option.value !== paymentMethod.value) {
            setPaymentMethod(option);

            if (option.value === 2 && bankAccounts.length === 0) {
                const bankAccountsResponse = await getBankAccounts("paginated=no");

                if (bankAccountsResponse) setBankAccounts(bankAccountsResponse.map(({ name, identifier, id, currency_id, currency, }) => {
                    return { label: name.concat(" - ", identifier), value: id, currency_id: currency_id, currency: currency.shortcode, };
                }));
            }
        }
    }

    const handleLocalSubmit = (e) => {
        e.preventDefault();
        let errors = [];

        const data = new FormData(e.target);

        try {
            if (data.get("amount") === "0,00") errors.push("El campo Monto es obligatorio.");

            if (paymentMethod.value === 2 && !bankAccount) {
                errors.push("El campo Cuenta es obligatorio.");
            }

            if (errors.length > 0) throw new Error(errors.join(";"));

            handleSubmit(data);
    
            e.target.reset();
        } catch (error) {
            setError({ show: true, message: error.message.split(";"), variant: "danger", });
        }
    }

    const handleReset = () => {
        setBankAccount(null);
    }

    return(
        <form onSubmit={handleLocalSubmit} onReset={handleReset}>
            <div className="row mb-3">
                <div className="col">
                    <input type="hidden" id="paymentMethod" name="paymentMethod" value={paymentMethod.label} />
                    <label htmlFor="paymentMethod_id" className="form-label">Medio de pago <span className="Required">*</span></label>
                    <Select
                        inputId="paymentMethod_id"
                        name="paymentMethod_id"
                        options={[
                            { label: "Efectivo", value: 1 },
                            { label: "Transferencia", value: 2 },
                        ]}
                        value={paymentMethod}
                        placeholder="Selecciona el método de pago"
                        noOptionsMessage={() => "No hay coincidencias"}
                        onChange={handlePaymentMethodChange}
                    />
                </div>
                <div className="col">
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" onChange={() => null} />
                </div>
                <input type="hidden" name="currency_id" value={paymentMethod.value == 1 ? (country?.currency_id || session.country.currency_id) : (bankAccount?.currency_id || 0)} />
                <input type="hidden" name="currency" value={paymentMethod.value == 1 ? (country?.currency || session.country.currency.shortcode) : (bankAccount?.currency || "")} />
            </div>
                <div className={`row mb-3 ${paymentMethod.value !== 2 ? 'd-none' : 'd-block'}`}>
                    <div className="col-6">
                        <input type="hidden" name="account" value={bankAccount?.label || ""} />
                        <label htmlFor="account_id" className="form-label">Cuenta <span className="Required">*</span></label>
                        <Select
                            inputId="account_id"
                            name="account_id"
                            options={bankAccounts}
                            value={bankAccount}
                            placeholder="Selecciona la cuenta"
                            noOptionsMessage={() => "No hay coincidencias"}
                            onChange={setBankAccount}
                        />
                    </div>
                </div>
            <div className="row mb-3">
                <div className="col-6">
                    <Form.Check id="isDuplicated" name="isDuplicated" label={`Duplicado`} />
                </div>
            </div>
            <div className="row text-end">
                <div className="col">
                    <button type="submit" className="btn btn-outline-primary">Agregar</button>
                </div>
            </div>
        </form>
    )
}

export default TypeTwoWalletAccountReportForm;