import "./ReportCard.css";
import PropTypes from "prop-types";
import { useFormatDate } from "../../hooks/useFormatDate";
import reportsColumnsMap from "../../consts/ReportsColumnsMap";
import { formatAmount } from "../../utils/amount";
import { divideInGroups } from "../../utils/array";
import { VZLA_CURRENCY } from "../../consts/currencies";

export default function ReportCard({ report, onClick = () => null }) {
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

  return (
    <div className="container">
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
      <div className="col">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => onClick(report.id)}
        >
          Verificar
        </button>
      </div>
    </div>
  );
}

ReportCard.propTypes = {
  report: PropTypes.object.isRequired,
};
