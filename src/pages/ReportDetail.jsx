import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReportById } from "../helpers/reports";
import { Alert, Card } from "react-bootstrap";

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

    const subreports = report ? JSON.parse(report.subreports) : [];

    return (
        <>
            {/* Breadcrumb */}
            <section className="p-2">
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
            </section>
            <section className="p-2 row mt-3 justify-content-end">
                <Card className="col-6">
                    <Card.Header as={"h5"}>Sobre el reporte:</Card.Header>
                    <Card.Body>
                        <div className="row mb-2">
                            <div className="col-6">
                                <h6>RESPONSABLE:</h6>
                            </div>
                            <div className="col-6">
                                <h6>ROL:</h6>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <h6>FECHA Y HORA:</h6>
                            </div>
                            <div className="col-6">
                                <h6>ID REPORTE:</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <h6>MOTIVO:</h6>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </section>
        </>
    );
}