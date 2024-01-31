import { Card } from "react-bootstrap";
import reportsColumnsMap from "../../consts/ReportsColumnsMap";
import { formatAmount } from "../../utils/amount";
import { divideInGroups } from "../../utils/array";

export default function DuplicateInfoCard({ data = null }) {
    let rows = [];

    if (data) {
        const filteredFields = [];
        for (const key of reportsColumnsMap.keys()) {
            if (Object.keys(data).includes(key)) {
                let formated = data[key];
                if (key === "amount") formated = formatAmount(formated);
                filteredFields.push([reportsColumnsMap.get(key), formated]);
            }
        }

        rows = divideInGroups(filteredFields);
    }

    return (
        <Card.Body>
            {
                data && rows.map((row, index) => <div key={index} className="row mb-3">
                    {
                        row.map(([key, value]) => <div key={key} className="col">
                            <h6 style={{color: "#6C7DA3", fontSize: "12px", fontWeight: 600, textTransform: "uppercase"}}>{key}</h6>
                            <span style={{color: "#495057", fontSize: "16px", fontWeight: 600}}>{value}</span>
                        </div>)
                    }
                </div>)
            }
        </Card.Body>
    );
}