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

const componentsDictionary = new Map();
componentsDictionary.set(1, <SupplierReportForm />)
componentsDictionary.set(2, <ReceivedHelpReportForm />)
componentsDictionary.set(3, <IncomeWalletReportForm />)
componentsDictionary.set(5, <StoreReportForm />)
componentsDictionary.set(6, <OutcomeWalletReportForm />)
componentsDictionary.set(7, <SendedHelpReportForm />)
componentsDictionary.set(8, <TransferReportForm />)
componentsDictionary.set(9, <RefillReportForm />)
componentsDictionary.set(10, <TaxReportForm />)
componentsDictionary.set(11, <CreditReportForm />)
componentsDictionary.set(12, <OtherReportForm />)
componentsDictionary.set(101, <TypeOneWalletReportForm />)
componentsDictionary.set(102, <TypeOneDraftReportForm />)
componentsDictionary.set(107, "<TypeTwoWalletAccountReportForm />")
componentsDictionary.set(103, "<TypeTwoCashReportForm />")
componentsDictionary.set(104, "<TypeTwoTransferenceReportForm />")
componentsDictionary.set(105, "<TypeTwoHelpReportForm />")
componentsDictionary.set(106, "<TypeTwoTransferReportForm />")
componentsDictionary.set(108, "<TypeTwoCashDeliveryReportForm />")
componentsDictionary.set(109, "<TypeTwoDepositReportForm />")
componentsDictionary.set(110, "<TypeTwoTransferenceReportForm />")
componentsDictionary.set(111, "<TypeTwoTaxReportForm />")
componentsDictionary.set(112, "<TypeTwoCreditReportForm />")
componentsDictionary.set(113, "<TypeTwoPayrollReportForm />")

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
                label: "Nómina R2",
                value: 113
            },
        ]
    }
]

const ReportForm = () => {
    const [reportType, setReportType] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            // if (true) { // User de VZLA
            //     // Buscar los tipos de reportes sueltos
            //     // Asignar los valores al estado de tipo de reportes

            // } else { // User internacional
            //     // Buscar los reportes (tipo 1 y tipo 2)
            //     // Asignar los valores a un ref
            //     // 

            // }
        }
        fetchData();
    }, [])

    const handleReport = ({ value }) => {
        console.log(value)
    }

    const handleReportType = ({ value }) => {
        setReportType(value)
    }

    return(
        <>
            <section className="container p-4">
                <p>Agrega un nuevo reporte +</p>
                <div>
                    <h1>Nuevo Reporte</h1>
                    <button type="button" className="btn btn-primary">Guardar +</button>
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
                <form method="" action="" className="" onSubmit={() => null}>
                    {
                        componentsDictionary.has(reportType) && componentsDictionary.get(reportType)
                    }
                    <div className="row mt-3">
                        <div className="col text-center">
                            Error Message
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col text-end">
                            <input type="submit" value="Agregar" className="btn btn-outline-primary" />
                        </div>
                    </div>
                </form>
            </section>
        </>
    )
}

export default ReportForm;