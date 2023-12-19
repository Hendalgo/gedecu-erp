import Select from "react-select";
import SupplierReportForm from "../components/reports/income/SupplierReportForm";
import { useEffect, useState } from "react";
import StoreReportForm from "../components/reports/outcome/StoreReportForm";
import OutcomeWalletReportForm from "../components/reports/outcome/WalletReportForm";
import IncomeWalletReportForm from "../components/reports/income/WalletReportForm";
import SendedHelpReportForm from "../components/reports/outcome/SendedHelpReportForm";
import ReceivedHelpReportForm from "../components/reports/income/ReceivedHelpReportForm";
import TransferReportForm from "../components/reports/outcome/TransferReportForm";
import RefillReportForm from "../components/reports/outcome/RefillReportForm";
import TaxReportForm from "../components/reports/outcome/TaxReportForm";
import CreditReportForm from "../components/reports/outcome/CreditReportForm";
import OtherReportForm from "../components/reports/outcome/OtherReportForm";
import TypeOneWalletReportForm from "../components/reports/income/TypeOneWalletReportForm";
import TypeOneDraftReportForm from "../components/reports/income/TypeOneDraftReportForm";
import TypeTwoWalletAccountReportForm from "../components/reports/outcome/TypeTwoWalletAccountReportForm";
import TypeTwoCashReportForm from "../components/reports/income/TypeTwoCashReportForm";
import TypeTwoHelpReportForm from "../components/reports/income/TypeTwoHelpReportForm";
import TypeTwoTransferReportForm from "../components/reports/income/TypeTwoTransferReportForm";
import TypeTwoCashDeliveryReportForm from "../components/reports/outcome/TypeTwoCashDeliveryReportForm";
import TypeTwoDepositReportForm from "../components/reports/outcome/TypeTwoDepositReportForm";
import TypeTwoOutcomeTransferenceReportForm from "../components/reports/outcome/TypeTwoOutcomeTransferenceReportForm";
import { Alert } from "react-bootstrap";
import TypeTwoIncomeTransferenceReportForm from "../components/reports/income/TypeTwoIncomeTransferenceReportForm";

const componentsDictionary = new Map();
componentsDictionary.set(1, <SupplierReportForm />)
componentsDictionary.set(2, <ReceivedHelpReportForm />)
componentsDictionary.set(3, <IncomeWalletReportForm />)
componentsDictionary.set(101, <TypeOneWalletReportForm />)
componentsDictionary.set(102, <TypeOneDraftReportForm />)
componentsDictionary.set(103, <TypeTwoCashReportForm />)
componentsDictionary.set(104, <TypeTwoIncomeTransferenceReportForm />)
componentsDictionary.set(105, <TypeTwoHelpReportForm />)
componentsDictionary.set(106, <TypeTwoTransferReportForm />)
componentsDictionary.set(5, <StoreReportForm />)
componentsDictionary.set(6, <OutcomeWalletReportForm />)
componentsDictionary.set(7, <SendedHelpReportForm />)
componentsDictionary.set(8, <TransferReportForm />)
componentsDictionary.set(9, <RefillReportForm />)
componentsDictionary.set(10, <TaxReportForm />)
componentsDictionary.set(11, <CreditReportForm />)
componentsDictionary.set(12, <OtherReportForm />)
componentsDictionary.set(107, <TypeTwoWalletAccountReportForm />)
componentsDictionary.set(108, <TypeTwoCashDeliveryReportForm />)
componentsDictionary.set(109, <TypeTwoDepositReportForm />)
componentsDictionary.set(110, <TypeTwoOutcomeTransferenceReportForm />)
componentsDictionary.set(111, <TaxReportForm />)
componentsDictionary.set(112, <CreditReportForm />)
componentsDictionary.set(113, <OtherReportForm />)

const tableColumnsDictionary = new Map();
tableColumnsDictionary.set("receiverAccount", "Cuenta receptora");
tableColumnsDictionary.set("senderAccount", "Cuenta emisora");
tableColumnsDictionary.set("amount", "Monto");
tableColumnsDictionary.set("reference", "Referencia");
tableColumnsDictionary.set("user", "Gestor");
tableColumnsDictionary.set("transferencesQuantity", "N° de transferencias");
tableColumnsDictionary.set("rate", "Tasas");
tableColumnsDictionary.set("conversion", "Conversión");
tableColumnsDictionary.set("account", "Cuenta bancaria");
tableColumnsDictionary.set("store", "Local");
tableColumnsDictionary.set("motive", "Motivo");
tableColumnsDictionary.set("supplier", "Proveedor");

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
    const [error, setError] = useState({ show: false, message: "", variant: 'primary' });
    const [tableHeaderColumns, setTableHeaderColumns] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // throw new Error("This is a test error")
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
        setTableHeaderColumns([]);
        setTableData([]);
        setReportType(value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData(e.target);

        if (tableHeaderColumns.length === 0) {
            const headers = [];

            data.forEach((value, key) => {
                headers.push(tableColumnsDictionary.get(key));
            });

            setTableHeaderColumns(headers);
        }
        
    }

    const postReport = () => {
        alert("Save all reports");
    }

    return(
        <>
            <section className="container p-2">
                <p>Agrega un nuevo reporte +</p>
                <div className="d-flex justify-content-between">
                    <h1>Nuevo Reporte</h1>
                    <button type="button" className="btn btn-primary w-auto" onClick={postReport}>Guardar +</button>
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
                <form method="" action="" className="" onSubmit={handleSubmit} autoComplete="off">
                    {
                        componentsDictionary.has(reportType) && componentsDictionary.get(reportType)
                    }
                    <div className="row mt-3">
                        <div className="col text-center">
                            <Alert variant={error.variant} show={error.show}>
                                {
                                    error.message
                                }
                            </Alert >
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col text-end">
                            <input type="submit" value="Agregar" className="btn btn-outline-primary" />
                        </div>
                    </div>
                </form>
            </section>
            <section>
                <table className="w-100 table">
                    <thead>
                        <tr>
                            {
                                tableHeaderColumns.map((header, index) => {
                                    return <th key={index}>{ header }</th>
                                })
                            }
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tableData.map((_, index) => {
                                return <tr key={index}></tr>
                            })
                        }
                    </tbody>
                </table>
            </section>
        </>
    )
}

export default ReportForm;