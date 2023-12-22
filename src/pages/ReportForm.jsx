import Select from "react-select";
import { useContext, useEffect, useRef, useState } from "react";
import { Alert } from "react-bootstrap";
import { ReportTableContext } from "../context/ReportTableContext";
import reportsColumnsMap from "../consts/ReportsColumnsMap";
import componentsMap from "../consts/ReportsComponentsMap";
import ModalConfirmation from "../components/ModalConfirmation";
import { getReportTypes } from "../helpers/reports";
import { SessionContext } from "../context/SessionContext";

const reports = [
    { value: 1, label: "Reporte Tipo 1" },
    { value: 2, label: "Reporte Tipo 2" },
]

const ReportForm = () => {
    const [reportType, setReportType] = useState(null);
    const [reportTypes, setReportTypes] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [error, setError] = useState({ show: false, message: [], variant: 'danger' });
    const [tableData, setTableData] = useState({ header: [], body: [], footer: 0 });
    const reportTypeAux = useRef(null);
    const { session } = useContext(SessionContext);

    useEffect(() => {
        const fetchData = async () => {
            try {

                if (session.country_id === 2) { // Venezuela
                    const reportTypesResponse = await getReportTypes("paginated=no");

                    if (reportTypesResponse) {
                        const incomeReports = []; const outcomeReports = [];

                        reportTypesResponse.forEach((reportType) => {
                            if (reportType.type === "income") incomeReports.push({ value: reportType.id, label: reportType.name });
                            if (reportType.type === "expense") outcomeReports.push({ value: reportType.id, label: reportType.name });
                        });

                        setReportTypes([
                            { label: "INGRESO", options: incomeReports },
                            { label: "EGRESO", options: outcomeReports },
                        ])
                    }
                } else {
                    console.log()
                }
            } catch (error) {
                setError({
                    show: true,
                    message: [error.message],
                    variant: "danger"
                })
            }
        }

        fetchData();
    }, [session.country_id])

    const handleReport = ({ value }) => {
        console.log(value)
    }

    const handleReportType = (option) => {
        if (option.value !== reportType?.value) {
            if (tableData.body.length > 0) {
                reportTypeAux.current = option;
                setShowConfirmation(true);
            } else {
                setReportType(option);
            }

            clearError();
        }
    }

    const handleReportChangeConfirm = () => {
        setReportType(reportTypeAux.current);
        clearTableData();
    }

    const clearError = () => {
        setError({ show: false, message: [], variant: "danger", });
    }

    const clearTableData = () => {
        setTableData({ header: [], body: [], })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        clearError();

        const data = new FormData(event.target);

        try {
            const newEntry = {};
            let footAmount = 0;
            let headColumns = [...tableData.header];
            let errors = [];
    
            data.forEach((value, key) => {
                if (!value || value == "0,00" || value == 0) {
                    errors.push(`El campo ${reportsColumnsMap.get(key)} posee un valor inadecuado.`);
                } else {
                    if (key === "amount") {
                        footAmount = new Number(value.replace(/[.,]/gi, '')) / 100;
                    }
                    newEntry[key] = value.trim();
                }
            });
    
            if (errors.length > 0) throw new Error(errors.join(";"));

            if ([8, 106].includes(reportType)) { // Traspasos
                const senderAccount = data.get("senderAccount");
                const receiverAccount = data.get("receiverAccount");

                if (senderAccount.toLowerCase() === receiverAccount.toLowerCase()) {
                    throw new Error("Las cuentas bancarias deben ser diferentes.");
                }
            }

            if (tableData.header.length === 0) {
                for (let key of data.keys()) headColumns.push(reportsColumnsMap.get(key));
            }

            setTableData((prev) => ({ header: headColumns, body: [...prev.body, newEntry], footer: prev.footer + footAmount }));
    
            event.target.reset();
        } catch (error) {
            setError({
                message: error.message.split(';'),
                show: true,
                variant: "danger",
            })
        }
    }

    const handleDelete = (index) => {
        const newEntries = [...tableData.body];
        let columns = [...tableData.header];

        newEntries.splice(index, 1);

        if (newEntries.length === 0) columns = [];

        setTableData(({header: columns, body: newEntries}));
    }

    const postReport = () => {
        setError({
            show: true,
            message: [JSON.stringify({
                id: 0,
                reportType: reportType.value,
                table: tableData.body,
                totalAmount: tableData.footer,
            })],
            variant: "success"
        })
        // Crear data del reporte según tipo de reporte
        // Mandar a servidor
        // Validar respuesta
        // Redireccionar
    }

    return(
        <>
            <section className="container p-2 mb-4">
                <div className="WelcomeContainer pb-2">
                    <h6 className="welcome">Agregar un nuevo reporte <span className="text-dark fs-5 fw-bold">+</span></h6>
                    <div className="d-flex align-items-center justify-content-between">
                        <h4>Nuevo Reporte</h4>
                        <button type="button" className="btn btn-primary w-auto" disabled={tableData.body.length === 0} onClick={postReport}>Guardar +</button>
                    </div>
                </div>
            </section>
            <section className="container card border border-0 rounded p-4 pb-2 mb-4">
                <div className="WelcomeContainer row align-items-center pb-2">
                    <div className="col-4">
                        <h5 style={{ color: "#052C65" }}>Tipo de reporte</h5>
                        <h6 className="welcome">Selecciona el tipo de reporte para continuar</h6>
                    </div>
                    <Select
                        inputId="reportTypes"
                        name="reportTypes"
                        options={reports}
                        placeholder="Reporte"
                        noOptionsMessage={() => "No hay resultados."}
                        className={`${session.country_id !== 2 ? '' : 'invisible'} col-4`}
                        onChange={handleReport}
                    />
                    <Select
                        inputId="reports"
                        name="reports"
                        options={reportTypes}
                        placeholder="Tipo de reporte"
                        value={reportType}
                        noOptionsMessage={() => "No hay resultados."}
                        className="col-4"
                        onChange={handleReportType}
                    />
                </div>
                <ReportTableContext.Provider value={{ handleSubmit, }}>
                    <div className="py-4">
                        {
                            reportType && componentsMap.has(reportType.value) && componentsMap.get(reportType.value)
                        }
                    </div>
                </ReportTableContext.Provider>
                <Alert show={error.show} variant={error.variant}>
                    <ul>
                        {
                            error.message.map((error, index) => <li key={index}>{error}</li>)
                        }
                    </ul>
                </Alert>
            </section>
            <section>
                {
                    (tableData && tableData.header.length > 0) &&
                    <table className="table TableP table-striped">
                        <thead>
                            <tr>
                                {
                                    tableData.header.map((header, hIndex) => <th key={hIndex}>{header}</th>)
                                }
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tableData.body.map((entry, rowIndex) => {
                                    return <tr key={rowIndex}>
                                        {
                                            Object.values(entry)
                                            .concat("delete")
                                            .map((value, cellIndex) => {
                                                return <td key={cellIndex}>{value === "delete" ?
                                                <button className="TableActionButtons" onClick={() => handleDelete(rowIndex)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M15.3332 3C15.3332 2.44772 14.8855 2 14.3332 2H11.8158C11.3946 0.804906 10.267 0.0040625 8.99985 0H6.99985C5.73269 0.0040625 4.6051 0.804906 4.18385 2H1.6665C1.11422 2 0.666504 2.44772 0.666504 3C0.666504 3.55228 1.11422 4 1.6665 4H1.99985V12.3333C1.99985 14.3584 3.64147 16 5.6665 16H10.3332C12.3582 16 13.9998 14.3584 13.9998 12.3333V4H14.3332C14.8855 4 15.3332 3.55228 15.3332 3ZM11.9998 12.3333C11.9998 13.2538 11.2537 14 10.3332 14H5.6665C4.74604 14 3.99985 13.2538 3.99985 12.3333V4H11.9998V12.3333Z" fill="#495057"/>
                                                        <path d="M6.33301 12C6.88529 12 7.33301 11.5523 7.33301 11V7C7.33301 6.44772 6.88529 6 6.33301 6C5.78073 6 5.33301 6.44772 5.33301 7V11C5.33301 11.5523 5.78073 12 6.33301 12Z" fill="#495057"/>
                                                        <path d="M9.6665 12C10.2188 12 10.6665 11.5523 10.6665 11V7C10.6665 6.44772 10.2188 6 9.6665 6C9.11422 6 8.6665 6.44772 8.6665 7V11C8.6665 11.5523 9.11422 12 9.6665 12Z" fill="#495057"/>
                                                    </svg>
                                                </button> :
                                                value}</td>
                                            })
                                        }
                                    </tr>
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                    {
                                        tableData.footer > 0 &&
                                        <td colSpan={tableData.header.length + 1} className="text-end"><strong>Monto total: {tableData.footer.toLocaleString("es-VE")}</strong></td>
                                    }
                            </tr>
                        </tfoot>
                    </table>
                }
            </section>
            <ModalConfirmation
            show={showConfirmation}
            setModalShow={setShowConfirmation}
            action={handleReportChangeConfirm}
            warning="Si cambia el reporte, se perderán todos los registros creados. ¿Está seguro?"
            confirmButtonLabel="Confirmar" />
        </>
    )
}

export default ReportForm;