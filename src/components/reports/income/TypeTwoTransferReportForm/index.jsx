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
    const { handleSubmit } = useContext(ReportTableContext);

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

    const handleReset = () => {
        setSelectedReceiverAccount(null);
        setSelectedSenderAccount(null);
    }

    return(
        <form onSubmit={handleSubmit} onReset={handleReset} autoComplete="off">
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="senderAccount" className="form-label">Cuenta emisora <span className="Required">*</span></label>
                    <Select
                        inputId="senderAccount"
                        name="senderAccount"
                        options={senderBankAccounts}
                        value={selectedSenderAccount}
                        placeholder="Selecciona la cuenta emisora"
                        noOptionsMessage={() => "No hay coincidencias"}
                        onChange={(event) => handleSenderAccountChange(event)}
                        isClearable
                    />
                </div>
                <div className="col">
                    <label htmlFor="receiverAccount" className="form-label">Cuenta receptora <span className="Required">*</span></label>
                    <Select
                        inputId="receiverAccount"
                        name="receiverAccount"
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
                    <label htmlFor="amount" className="form-label">Monto en COP <span className="Required">*</span></label>
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