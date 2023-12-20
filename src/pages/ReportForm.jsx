import Select from "react-select";
import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { ReportTableContext } from "../context/ReportTableContext";
import reportsColumnsMap from "../consts/ReportsColumnsMap";
import componentsMap from "../consts/ReportsComponentsMap";

const reports = [
    { value: 1, label: "Reporte Tipo 1" },
    { value: 2, label: "Reporte Tipo 2" },
]

const reportTypes = [
    {
        label: "Ingreso",
        options: [
            {
                label: "Proveedor",
                value: 1
            },
            {
                label: "Ayuda recibida",
                value: 2
            },
            {
                label: "Billetera",
                value: 3
            },
            {
                label: "Billetera R1",
                value: 101
            },
            {
                label: "Giros R1",
                value: 102
            },
            {
                label: "Cuenta de billetera R2",
                value: 114
            },
            {
                label: "Efectivo R2",
                value: 103
            },
            {
                label: "Transferencia R2",
                value: 104
            },
            {
                label: "Ayuda R2",
                value: 105
            },
            {
                label: "Traspaso R2",
                value: 106
            },
        ]
    },
    {
        label: "Egreso",
        options: [
            {
                label: "Local",
                value: 5
            },
            {
                label: "Billetera",
                value: 6
            },
            {
                label: "Ayuda realizada",
                value: 7
            },
            {
                label: "Traspasos",
                value: 8
            },
            {
                label: "Recargas",
                value: 9
            },
            {
                label: "Comisiones",
                value: 10
            },
            {
                label: "Créditos",
                value: 11
            },
            {
                label: "Otros",
                value: 12
            },
            {
                label: "Cuenta de billetera R2",
                value: 107
            },
            {
                label: "Entrega efectivo R2",
                value: 108
            },
            {
                label: "Depósitos R2",
                value: 109
            },
            {
                label: "Transferencias R2",
                value: 110
            },
            {
                label: "Comisiones R2",
                value: 111
            },
            {
                label: "Créditos R2",
                value: 112
            },
            {
                label: "Otros R2",
                value: 113
            },
        ]
    }
]

const ReportForm = () => {
    const [reportType, setReportType] = useState(0);
    const [error, setError] = useState({ show: false, message: "", variant: 'danger' });
    const [tableData, setTableData] = useState({ header: [], body: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                throw new Error("This is a test error")
                // if (true) { // User de VZLA
                //     // Buscar los tipos de reportes sueltos
                //     // Asignar los valores al estado de tipo de reportes

                // } else { // User internacional
                //     // Buscar los reportes (tipo 1 y tipo 2)
                //     // Asignar los valores a un ref
                //     // 

                // }
        } catch (error) {
                console.error(error)
                setError({
                    show: true,
                    message: error.message,
                    variant: "danger"
                })
            }
        }
        fetchData();
    }, [])

    const handleReport = ({ value }) => {
        console.log(value)
    }

    const handleReportType = ({ value }) => {
        setTableData({ header: [], body: [] });
        setReportType(value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = new FormData(event.target);

        if (tableData.header.length === 0) {
            const columns = [];

            for (let key of data.keys()) columns.push(reportsColumnsMap.get(key));

            setTableData((prev) => ({...prev, header: columns}));
        }

        try {
            const newEntry = {};
            let errors = [];
    
            data.forEach((value, key) => {
                if (!value || value.startsWith("0,0")) {
                    errors.push(`El campo ${reportsColumnsMap.get(key)} posee un valor inadecuado`);
                } else {
                    newEntry[key] = value;
                }
            });
    
            if (errors.length > 1) throw new Error(errors.join());
    
            setTableData((prev) => ({...prev, body: [...prev.body, newEntry]}));
    
            event.target.reset();
        } catch (error) {
            console.error(error);
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
        console.log(JSON.stringify(tableData.body))
        // Validar reportes
        // Crear data del reporte según tipo de reporte
        // Mandar a servidor
        // Validar respuesta
        // Redireccionar
    }

    return(
        <>
            <section className="container p-2">
                <p>Agrega un nuevo reporte +</p>
                <div className="d-flex justify-content-between">
                    <h1>Nuevo Reporte</h1>
                    <button type="button" className="btn btn-primary w-auto" disabled={tableData.body.length === 0} onClick={postReport}>Guardar +</button>
                </div>
            </section>
            <section className="container p-2">
                <div className="row align-items-center">
                    <div className="col-4">
                        <h2>Tipo de reporte</h2>
                        <p>Selecciona el tipo de reporte para continuar</p>
                    </div>
                    <Select
                        inputId="reportTypes"
                        name="reportTypes"
                        options={reports}
                        placeholder="Reporte"
                        noOptionsMessage={() => "No hay resultados."}
                        className="col-4"
                        onChange={handleReport}
                    />
                    <Select
                        inputId="reports"
                        name="reports"
                        options={reportTypes}
                        placeholder="Tipo de reporte"
                        noOptionsMessage={() => "No hay resultados."}
                        className="col-4"
                        onChange={handleReportType}
                    />
                </div>
                <ReportTableContext.Provider value={{ handleSubmit, }}>
                    {
                        componentsMap.has(reportType) && componentsMap.get(reportType)
                    }
                </ReportTableContext.Provider>
                <Alert show={error.show} variant={error.variant} className="my-3">
                    {
                        error.message
                    }
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
                    </table>
                }
            </section>
        </>
    )
}

export default ReportForm;