import { useContext, useEffect, useRef, useState } from "react";
import { getBankAccounts } from "../../../../helpers/banksAccounts";
import Select from "react-select";
import DecimalInput from "../../../DecimalInput";
import { ReportTableContext } from "../../../../context/ReportTableContext";

const TypeTwoTransferReportForm = () => { // Reporte de traspaso Tipo 2
    const [senderBankAccounts, setSenderBankAccounts] = useState([]);
    const [selectedSenderAccount, setSelectedSenderAccount] = useState(null);
    const [receiverBankAccounts, setReceiverBankAccounts] = useState([]);
    const [selectedReceiverAccount, setSelectedReceiverAccount] = useState(null);
    const bankAccounts = useRef([]);
    const { handleSubmit, setError } = useContext(ReportTableContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [banksAccountsResponse] = await Promise.all([ getBankAccounts("paginated=no"), ]);

                if (banksAccountsResponse) bankAccounts.current = banksAccountsResponse;

                setSenderBankAccounts(banksAccountsResponse.map(({ name, identifier, id }) => ({ label: name.concat(" - ", identifier), value: id })))

                setReceiverBankAccounts(banksAccountsResponse.map(({ name, identifier, id }) => ({ label: name.concat(" - ", identifier), value: id })))
            } catch (error) {
                console.error(error)
            }
        }

        fetchData();
    }, [])

    const handleSenderAccountChange = (option) => {
        const newOptions = bankAccounts.current
        .filter(({ id }) => id != option?.value || !option)
        .map(({ id, identifier, name, }) => ({value: id, label: name.concat(" - ", identifier)}));

        setReceiverBankAccounts(newOptions);

        setSelectedSenderAccount(option);
    }

    const handleReceiverAccountChange = (option) => {
        const newOptions = bankAccounts.current
        .filter(({ id }) => id != option?.value || !option)
        .map(({ id, identifier, name, }) => ({value: id, label: name.concat(" - ", identifier)}));

        setSenderBankAccounts(newOptions);

        setSelectedReceiverAccount(option);
    }

    const handleLocalSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let errors = [];

        try {
            if (!selectedSenderAccount) errors.push("El campo Cuenta emisora es obligatorio.");
            if (!selectedReceiverAccount) errors.push("El campo Cuenta receptora es obligatorio.");
            if (formData.get("amount") === "0,00") errors.push("El campo Monto es obligatorio.");

            if ((selectedSenderAccount && selectedReceiverAccount) && selectedSenderAccount.value === selectedReceiverAccount.value) errors.push("Las cuentas bancarias deben ser diferentes.");
            
            if (errors.length > 0) throw new Error(errors.join(";"));
            
            formData.append("senderAccount", selectedSenderAccount.label);
            formData.append("receiverAccount", selectedReceiverAccount.label);
            
            handleSubmit(formData);
            
            e.target.reset();
        } catch (error) {
            setError({
                show: true,
                message: error.message.split(";"),
                variant: "danger",
            });
        }
    }

    const handleReset = () => {
        setSelectedReceiverAccount(null);
        setSelectedSenderAccount(null);
    }

    return(
        <form onSubmit={handleLocalSubmit} onReset={handleReset} autoComplete="off">
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="senderAccount_id" className="form-label">Cuenta emisora <span className="Required">*</span></label>
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
                    <label htmlFor="receiverAccount_id" className="form-label">Cuenta receptora <span className="Required">*</span></label>
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
                    <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                    <DecimalInput id="amount" name="amount" />
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

export default TypeTwoTransferReportForm;