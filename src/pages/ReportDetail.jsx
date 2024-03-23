import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteSubreport, getReportById, updateReport } from "../helpers/reports";
import { Alert, Card } from "react-bootstrap";
import reportsColumnsMap from "../consts/ReportsColumnsMap";
import { useFormatDate } from "../hooks/useFormatDate";
import { formatAmount } from "../utils/amount";
import { handleError } from "../utils/error";
import ModalConfirmation from "../components/ModalConfirmation";
import { ReportTableContext } from "../context/ReportTableContext";
import componentsMap from "../consts/ReportsComponentsMap";
import { formatField } from "../utils/text";
import { SessionContext } from "../context/SessionContext";
import { REPORTS_ROUTE, USERS_ROUTE } from "../consts/Routes";

export default function ReportDetail() {
  const [report, setReport] = useState(null);
  const [subreportEdit, setSubreportEdit] = useState(null);
  const selectedSubreport = useRef(null);
  const [editing, setEditing] = useState(false);
  const [wantsToEdit, setWantsToEdit] = useState(false);
  const [showModal, setShowModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    show: false,
    message: [],
    variant: "danger",
  });
  const { session } = useContext(SessionContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportResponse = await getReportById(id);
        setReport(reportResponse);
      } catch ({ message, error }) {
        if (message)
          setError((prev) => ({ ...prev, show: true, message: [message] }));
      }
    };

    fetchData();
  }, [id]);

  const handleEditSubreport = (subreportIndex) => {
    setError({
      show: false,
      message: [],
      variant: "danger",
    });

    const subreport = report.subreports[subreportIndex];
    setSubreportEdit({ ...subreport })
    setEditing(true);
  };

  const handleCloseEdit = () => {
    setEditing(false);
    setSubreportEdit(null);
  };

  const handleEditSubmit = async (formData = new FormData()) => {
    const data = {};
    const subreports = [ ...report.subreports ];

    formData.forEach((val, key) => {
      data[key] = formatField(val, key);
    });

    if (!Object.keys(data).find((key) => key == "isDuplicated")) {
      data["isDuplicated"] = false;
    }

    try {
      const subreportIndex = subreports.findIndex(({ id, }) => id == subreportEdit.id);

      subreports[subreportIndex].data = data;

      selectedSubreport.current = null;
      setEditing(false);
      setSubreportEdit(null);
      setWantsToEdit(true);

      setReport((prev) => ({ ...prev, subreports }));
    } catch (err) {
      let errorsMessages = handleError(err);
      setError({
        show: true,
        message: errorsMessages,
        variant: "danger",
      });
    }
  };

  const handleEditFinish = async () => {
    setLoading(true);
    const data = report.subreports.map(({ id, data }) => {
      return {
        id,
        ...data,
      };
    });
    try {
      let response = await updateReport(data, report.id);
      if (response.status == 200) {
        setReport(prev => ({ ...prev, editable: 0 }));
        setWantsToEdit(false);
        setError({
          show: true,
          message: ["Edición exitosa"],
          variant: "success",
        });
      }
    } catch (err) {
      let errorsMessages = handleError(err);
      setError({
        show: true,
        message: errorsMessages,
        variant: "danger",
      });
    }
    setLoading(false);
  };

  const handleDeleteSubreport = async (subreportIndex) => {
    setError({
      show: false,
      message: [],
      variant: "danger",
    });

    if (editing) setEditing(false);
    if (subreportEdit) setSubreportEdit(null);

    if (report.subreports.length == 1) {
      selectedSubreport.current = report.subreports.at(0);

      setShowModal(true);
    } else {
      setLoading(true);
      const currentReport = { ...report, };

      const subreport = currentReport.subreports[subreportIndex];

      try {
        let response = await deleteSubreport(subreport.id);

        if (response.status == 200) {
          currentReport.subreports.splice(subreportIndex, 1);
          setReport(currentReport);
          setError({
            show: true,
            message: ["Eliminación exitosa"],
            variant: "success",
          });
        }
      } catch (err) {
        let errorsMessages = handleError(err);
  
        setError((prev) => ({
          ...prev,
          show: true,
          message: errorsMessages,
        }));
      }
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      let response = await deleteSubreport(selectedSubreport.current.id);

      if (response.status == 200) {
        const { user_id } = report;
        navigate(`../../${USERS_ROUTE}/${user_id}/${REPORTS_ROUTE}`, {
          relative: "path"
        });
      }
    } catch (err) {
      let errorsMessages = handleError(err);
  
      setError((prev) => ({
        ...prev,
        show: true,
        message: errorsMessages,
      }));
    }
  };

  const getSubreportsTable = () => {
    let footer = [];

    const jsonData = Object.keys(report.subreports.at(0).data);
    const fields = [];
    const titles = [];

    for (const [key, val] of reportsColumnsMap.entries()) {
      if (jsonData.includes(key)) {
        fields.push(key);
        titles.push(val);
      }
    }

    const subreports = report.subreports.map(({ data }) => {
      const parsed = data;
      let amount = new Number(parsed["amount"]);
      let currency = parsed["currency"];

      if (Boolean(data["convert_amount"]) == true) {
        const rate = new Number(data["rate"]);
        if (parsed["rate_currency"] == data["currency_id"]) {
          amount *= rate;
        } else {
          amount /= rate;
        }
        currency = parsed["conversionCurrency"];
      }

      const footerIndex = footer.findIndex(
        (total) => total.currency == currency,
      );

      if (footerIndex === -1) {
        footer.push({ currency, amount: new Number(amount) });
      } else {
        footer.at(footerIndex).amount += new Number(amount);
      }

      const values = fields.map((key) => {
        let formated = parsed[key];
        if (key == "isDuplicated") {
          formated = "No";
          if (parsed[key] == "1") {
            formated = "Sí";
          }
        }

        if (["amount", "rate", "conversion"].includes(key)) {
          formated = new Number(formated);
          formated = formatAmount(formated);
        }
        if (key.includes("date")) {
          formated = useFormatDate(formated, false);
        }

        return formated;
      });

      return values;
    });

    return { subreports, titles, footer };
  };

  if (!report) return <></>;

  const { subreports, titles, footer } = getSubreportsTable();
  const reportStyles = JSON.parse(report.type.config)?.styles;

  const checkDate = () => {
    const DAY_MILLISECONDS = 60 ** 2 * 1000 * 24; // Seconds in an hour times 1000 times 24 hours (a day)
    const now = Date.now();
    const reportDate = new Date(report.created_at).getTime();
    const difference = now - reportDate;
    if (session.role_id != 1 && difference <= DAY_MILLISECONDS && report.editable == "1") return true;
    return false;
  };

  return (
    <>
      <section className="p-2 pt-4 mb-4">
        <div className="WelcomeContainer">
          <h6 className="welcome">Información detallada</h6>
          <h4>Reporte #{id.toString().padStart(6, "0")}</h4>
        </div>
      </section>
      <section>
        {
          (wantsToEdit && checkDate()) &&
          <div className="text-end mb-3">
            <button type="button" onClick={handleEditFinish} disabled={loading} className="btn btn-primary">Finalizar edición</button>
          </div>
        }
        <div className="w-100 overflow-hidden overflow-x-auto border rounded mb-4">
          <table className="m-0 table table-striped">
            <thead>
              <tr>
                {titles.map((title, index) => (
                  <th key={index}>{title}</th>
                ))}
                {
                  session.role_id != 1 && <th></th>
                }
                {
                  session.role_id == 1 && <th></th>
                }
              </tr>
            </thead>
            <tbody>
              {subreports.map((row, index) => {
                return (
                  <tr key={`row-${index}`}>
                    {row.map((cell, childIndex) => (
                      <td key={childIndex}>{cell}</td>
                    ))}
                    {
                      session.role_id != 1 &&
                      <td>
                        {
                          checkDate() &&
                          <button
                            type="button"
                            className="TableActionButtons"
                            disabled={loading}
                            onClick={() => handleEditSubreport(index)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <g clipPath="url(#clip0_156_194122)">
                                <path
                                  d="M15.216 0.783999C14.7065 0.2971 14.0288 0.0253906 13.324 0.0253906C12.6192 0.0253906 11.9416 0.2971 11.432 0.783999L1.07401 11.142C0.732617 11.4815 0.46192 11.8853 0.277573 12.3301C0.0932258 12.7749 -0.00111372 13.2519 9.9204e-06 13.7333V15C9.9204e-06 15.2652 0.105367 15.5196 0.292903 15.7071C0.48044 15.8946 0.734793 16 1.00001 16H2.26668C2.74838 16.0013 3.22556 15.907 3.67059 15.7227C4.11562 15.5383 4.51967 15.2676 4.85934 14.926L15.216 4.568C15.7171 4.06582 15.9985 3.3854 15.9985 2.676C15.9985 1.9666 15.7171 1.28617 15.216 0.783999ZM3.44401 13.512C3.13093 13.823 2.708 13.9984 2.26668 14H2.00001V13.7333C2.00138 13.2916 2.1767 12.8681 2.48801 12.5547L10.2 4.84467L11.1553 5.8L3.44401 13.512ZM13.8 3.154L12.5693 4.38667L11.6133 3.43067L12.8467 2.2C12.9753 2.07705 13.1464 2.00844 13.3243 2.00844C13.5023 2.00844 13.6734 2.07705 13.802 2.2C13.9277 2.32704 13.9981 2.49867 13.9977 2.67741C13.9974 2.85615 13.9263 3.02749 13.8 3.154Z"
                                  fill="#495057"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_156_194122">
                                  <rect width="16" height="16" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </button>
                        }
                      </td>
                    }
                    {
                      session.role_id == 1 &&
                      <td>
                        <button
                          type="button"
                          className="TableActionButtons"
                          disabled={loading}
                          onClick={() => handleDeleteSubreport(index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M15.3332 3C15.3332 2.44772 14.8855 2 14.3332 2H11.8158C11.3946 0.804906 10.267 0.0040625 8.99985 0H6.99985C5.73269 0.0040625 4.6051 0.804906 4.18385 2H1.6665C1.11422 2 0.666504 2.44772 0.666504 3C0.666504 3.55228 1.11422 4 1.6665 4H1.99985V12.3333C1.99985 14.3584 3.64147 16 5.6665 16H10.3332C12.3582 16 13.9998 14.3584 13.9998 12.3333V4H14.3332C14.8855 4 15.3332 3.55228 15.3332 3ZM11.9998 12.3333C11.9998 13.2538 11.2537 14 10.3332 14H5.6665C4.74604 14 3.99985 13.2538 3.99985 12.3333V4H11.9998V12.3333Z"
                              fill="#495057"
                            />
                            <path
                              d="M6.33301 12C6.88529 12 7.33301 11.5523 7.33301 11V7C7.33301 6.44772 6.88529 6 6.33301 6C5.78073 6 5.33301 6.44772 5.33301 7V11C5.33301 11.5523 5.78073 12 6.33301 12Z"
                              fill="#495057"
                            />
                            <path
                              d="M9.6665 12C10.2188 12 10.6665 11.5523 10.6665 11V7C10.6665 6.44772 10.2188 6 9.6665 6C9.11422 6 8.6665 6.44772 8.6665 7V11C8.6665 11.5523 9.11422 12 9.6665 12Z"
                              fill="#495057"
                            />
                          </svg>
                        </button>
                      </td>
                    }
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              {footer.map(({ currency, amount }) => (
                <tr key={currency}>
                  <td className="fw-semibold text-end" colSpan={titles.length + 1}>
                    Total {currency}: {formatAmount(new Number(amount))}
                  </td>
                </tr>
              ))}
            </tfoot>
          </table>
        </div>
        <Alert show={error.show} variant={error.variant} dismissible onClose={() => setError((prev) => ({ ...prev, show: false, message: [] }))}>
          <ul className="m-0">
            {error.message.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </Alert>
      </section>
      {
        editing &&
        <section className="mt-3">
          <div className="text-end mb-3">
            <button type="button" className="btn btn-danger" onClick={() => handleCloseEdit()}>Cerrar</button>
          </div>
          <ReportTableContext.Provider value={{
            handleSubmit: handleEditSubmit, setError, country: null, selected: subreportEdit
          }}>
            {
              componentsMap.get(report.type_id)
            }
          </ReportTableContext.Provider>
        </section>
      }
      <section className="p-2 row mt-3 justify-content-end">
        <Card className="col-5">
          <Card.Header
            as={"h5"}
            style={{
              color: "#052C65",
              fontSize: "18px",
              fontWeight: 600,
              backgroundColor: "#fff",
            }}
          >
            Sobre el reporte:
          </Card.Header>
          <Card.Body>
            <div className="row">
              <div className="col-6">
                <h6
                  style={{
                    color: "#6C7DA3",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  RESPONSABLE:
                </h6>
                <p
                  style={{
                    color: "#495057",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  {report.user.name}
                </p>
              </div>
              <div className="col-6">
                <h6
                  style={{
                    color: "#6C7DA3",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  ROL:
                </h6>
                <p
                  style={{
                    color: "#495057",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  {report.user.role.name}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <h6
                  style={{
                    color: "#6C7DA3",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  FECHA Y HORA:
                </h6>
                <p
                  style={{
                    color: "#495057",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  {useFormatDate(report.created_at)}
                </p>
              </div>
              <div className="col-6">
                <h6
                  style={{
                    color: "#6C7DA3",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  ID REPORTE:
                </h6>
                <p
                  style={{
                    color: "#495057",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  #{report.id.toString().padStart(6, "0")}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <h6
                  style={{
                    color: "#6C7DA3",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  MOTIVO:
                </h6>
                <span className="rounded p-1 " style={reportStyles}>
                  {report.type.name}
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </section>
      <ModalConfirmation
        show={showModal}
        setModalShow={setShowModal}
        action={handleDeleteConfirm}
        warning="Eliminar este registro hará que se elimine el reporte. ¿Desea continuar?"
      />
    </>
  );
}
