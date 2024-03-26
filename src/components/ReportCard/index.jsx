import "./ReportCard.css";
import PropTypes from "prop-types";
import { useFormatDate } from "../../hooks/useFormatDate";
import reportsColumnsMap from "../../consts/ReportsColumnsMap";
import { formatAmount } from "../../utils/amount";
import { divideInGroups } from "../../utils/array";
import { VZLA_CURRENCY } from "../../consts/currencies";

export default function ReportCard({ report }) {
  const { store } = report.report.user;

  const formatInconsistenceData = () => {
    if (report) {
      let rows = [];
      const { data } = report;

      const keys = Object.keys(data);

      for (const key of reportsColumnsMap.keys()) {
        if (!["isDuplicated", "currency", "conversionCurrency"].includes(key)) {
          if (keys.includes(key)) {
            const value = data[key];

            let formated = value.trim();

            if (["amount", "rate", "conversion"].includes(key)) {
              let shortcode = "";

              if (key == "amount") {
                shortcode = data["currency"];
              }

              if (key == "conversion") {
                shortcode = VZLA_CURRENCY.shortcode;

                if (data["conversionCurrency"]) {
                  shortcode = data["conversionCurrency"];
                }
              }

              formated = formatAmount(new Number(formated), shortcode);
            }
            if (key.includes("date"))
              formated = useFormatDate(formated, false, true);
            rows.push([reportsColumnsMap.get(key), formated]);
          }
        }
      }
      return divideInGroups(rows);
    }
    return [];
  };

  let reportStyle = {};
  if (report) {
    reportStyle = JSON.parse(report.report.type.config).styles;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <h6
            className="m-0"
            style={{
              color: "#6C7DA3",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            CREADO POR
          </h6>
          <p
            style={{
              color: "#495057",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            {store ? (
              store.name
            ) : (
              <>
                {report.report.user.name} -{" "}
                <span
                  className="p-1 rounded"
                  style={{ ...reportStyle, fontWeight: "normal" }}
                >
                  {report.report.user.role.name}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="col-6">
          <h6
            className="m-0"
            style={{
              color: "#6C7DA3",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            ID REPORTE
          </h6>
          <p
            style={{
              color: "#495057",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            #{report.report_id.toString().padStart(6, "0")}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <h6
            className="m-0"
            style={{
              color: "#6C7DA3",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            MOTIVO
          </h6>
          <p>
            <span style={reportStyle} className="rounded p-1">
              {report.report.type.name} -{" "}
              {report.report.type.type == "income" ? "Ingreso" : "Egreso"}
            </span>
          </p>
        </div>
      </div>
      {formatInconsistenceData().map((row, index) => {
        return (
          <div key={index} className="row">
            {row.map(([key, val]) => {
              return (
                <div key={key} className="col-6">
                  <h6
                    className="m-0"
                    style={{
                      color: "#6C7DA3",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {key}
                  </h6>
                  <p
                    style={{
                      color: "#495057",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    {val}
                  </p>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

ReportCard.propTypes = {
  report: PropTypes.object.isRequired,
};
