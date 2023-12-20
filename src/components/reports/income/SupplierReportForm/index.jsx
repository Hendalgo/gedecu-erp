import DecimalInput from "../../../DecimalInput";
import BankAccountsSelect from "../../../BankAccountsSelect";
import UsersSelect from "../../../UsersSelect";
import { useState } from "react";
import reportsColumnsMap from "../../../../consts/ReportsColumnsMap";

const SupplierReportForm = () => {
    const [user, setUser] = useState(null);
    const [bankAccount, setBankAccount] = useState(null);
    const [tableHeader, setTableHeader] = useState([]);
    const [tableBody, setTableBody] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        if (tableHeader.length === 0) {
            const columns = [];

            for (let key of formData.keys()) {
                columns.push(reportsColumnsMap.get(key));
            }

            setTableHeader(columns);
        }

        const newEntry = {};

        formData.forEach((value, key) => {
            newEntry[key] = value;
        });

        setTableBody((prev) => [...prev, newEntry]);

        e.target.reset();
    }

    const handleReset = () => {
        setUser(null);
        setBankAccount(null);
    }

    const handleDelete = (index) => {
        const newEntries = [...tableBody];

        newEntries.splice(index, 1);

        setTableBody(newEntries);

        if (newEntries.length === 0) setTableHeader([]);
    }

    return(
        <>
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="supplier" className="form-label">Proveedor <span className="Required">*</span></label>
                        <UsersSelect id="supplier" name="supplier" value={user} onChange={setUser} placeholder="Selecciona al proveedor" query="&role=4" />
                    </div>
                    <div className="col">
                        <label htmlFor="receiverAccount" className="form-label">Cuenta receptora <span className="Required">*</span></label>
                        <BankAccountsSelect id="receiverAccount" name="receiverAccount" value={bankAccount} onChange={setBankAccount} placeholder="Selecciona la cuenta receptora" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="amount" className="form-label">Monto <span className="Required">*</span></label>
                        <DecimalInput id="amount" name="amount" />
                    </div>
                    <div className="col">
                        <label htmlFor="reference" className="form-label">Referencia <span className="Required">*</span></label>
                        <input type="text" id="reference" name="reference" maxLength={20} className="form-control" />
                    </div>
                </div>
                <div className="row text-end">
                    <div className="col">
                        <button type="submit" className="btn btn-outline-primary">Agregar</button>
                    </div>
                </div>
            </form>

            {
                tableHeader.length > 0 &&
                <table className="table">
                    <thead>
                        <tr>
                            {
                                tableHeader.map((header, index) => <th key={index}>{header}</th>)
                            }
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tableBody.map((entry, childIndex) => {
                                return <tr key={childIndex}>
                                    {
                                        Object.values(entry)
                                        .concat("delete")
                                        .map((value, cellIndex) => {
                                            return <td key={`cell-${childIndex}-${cellIndex}`}>
                                                {
                                                    (value === "delete") ?
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(childIndex)}>
                                                            Borrar
                                                        </button> :
                                                    value
                                                }
                                            </td>
                                        })
                                    }
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            }
        </>
    )
}

export default SupplierReportForm;