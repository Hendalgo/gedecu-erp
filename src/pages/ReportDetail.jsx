import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReportById } from "../helpers/reports";
import { Alert, Card } from "react-bootstrap";
import reportsColumnsMap from "../consts/ReportsColumnsMap";
import { useFormatDate } from "../hooks/useFormatDate";
import { formatAmount } from "../utils/amount";

export default function ReportDetail() {
    const [report, setReport] = useState(null);
    const [error, setError] = useState({ show: false, message: [], variant: "danger", });
    const {id} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const reportResponse = await getReportById(id);
                setReport(reportResponse);
            } catch ({message, error}) {
                if (message) setError((prev) => ({ ...prev, show: true, message: [message] }));
            }
        }

        fetchData();
    }, [id]);

    const getSubreportsTable = () => {
        let footer = [];

        const jsonData = Object.keys(JSON.parse(report.subreports.at(0).data));
        const fields = []; const titles = [];

        for (const [key, val] of reportsColumnsMap.entries()) {
            if (jsonData.includes(key)) {
                fields.push(key);
                titles.push(val);
            }
        }

        const subreports = report.subreports.map(({ data }) => {
            const parsed = JSON.parse(data);
            let amount = parsed["amount"];
            let currency = parsed["currency"];

            if (parsed["convert_amount"]) {
                amount *= parsed["rate"];
                currency = parsed["conversionCurrency"];
            }

            const footerIndex = footer.findIndex((total) => total.currency == currency);

            if (footerIndex === -1) {
                footer.push({currency, amount});
            } else {
                footer.at(footerIndex).amount += amount;
            }

            const values = fields.map((key) => {
                let formated = parsed[key];
                if (key == "isDuplicated") {
                    formated = "No";
                    if (parsed[key]) {
                        formated = "Sí"
                    }
                }

                if (["amount", "rate", "conversion"].includes(key)) {
                    formated = formatAmount(formated);
                }

                return formated;
            });

            return values;
        });

        return { subreports, titles, footer };
    }

    
    if (!report) return <></>;

    const { subreports, titles, footer } = getSubreportsTable();
    const reportStyles = JSON.parse(report.type.config)?.styles;

    return (
        <>
            <section className="p-2 mb-4">
                <div className="WelcomeContainer">
                    <h6 className="welcome">Información detallada</h6>
                    <h4>Reporte</h4>
                </div>
            </section>
            <Alert show={error.show} variant={error.variant}>
                <ul>
                    {
                        error.message.map((message, index) => <li key={index}>{message}</li>)
                    }
                </ul>
            </Alert>
            <section>
                <table className="table table-striped tableP">
                    <thead>
                        <tr>
                            {
                                titles.map((title, index) => <th key={index}>{title}</th>)
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            subreports.map((row, index) => {
                                return <tr key={`row-${index}`}>
                                    {
                                        row.map((cell, childIndex) => <td key={childIndex}>{cell}</td>)
                                    }
                                </tr>
                            })
                        }
                    </tbody>
                    <tfoot>
                        {
                            footer.map(({currency, amount}) => <tr key={currency}>
                                <td className="fw-semibold text-end" colSpan={titles.length}>Total {currency}: {formatAmount(amount)}</td>
                            </tr>)
                        }
                    </tfoot>
                </table>
            </section>
            <section className="p-2 row mt-3 justify-content-end">
                <Card className="col-5">
                    <Card.Header as={"h5"} style={{color: "#052C65", fontSize: "18px", fontWeight: 600, backgroundColor: "#fff"}}>Sobre el reporte:</Card.Header>
                    <Card.Body>
                        <div className="row">
                            <div className="col-6">
                                <h6 style={{color: "#6C7DA3", fontSize: "12px", fontWeight: 600}}>RESPONSABLE:</h6>
                                <p style={{color: "#495057", fontSize: "16px", fontWeight: 600}}>{report.user.name}</p>
                            </div>
                            <div className="col-6">
                                <h6 style={{color: "#6C7DA3", fontSize: "12px", fontWeight: 600}}>ROL:</h6>
                                <p style={{color: "#495057", fontSize: "16px", fontWeight: 600}}>{report.user.role.name}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <h6 style={{color: "#6C7DA3", fontSize: "12px", fontWeight: 600}}>FECHA Y HORA:</h6>
                                <p style={{color: "#495057", fontSize: "16px", fontWeight: 600}}>{useFormatDate(report.created_at)}</p>
                            </div>
                            <div className="col-6">
                                <h6 style={{color: "#6C7DA3", fontSize: "12px", fontWeight: 600}}>ID REPORTE:</h6>
                                <p style={{color: "#495057", fontSize: "16px", fontWeight: 600}}>#{report.id.toString().padStart(6, "0")}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <h6 style={{color: "#6C7DA3", fontSize: "12px", fontWeight: 600}}>MOTIVO:</h6>
                                <span className="rounded" style={reportStyles}>{report.type.name}</span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </section>
        </>
    );
}