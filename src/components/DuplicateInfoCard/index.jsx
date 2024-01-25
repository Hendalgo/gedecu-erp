import { Card } from "react-bootstrap";
import reportsColumnsMap from "../../consts/ReportsColumnsMap";

export default function DuplicateInfoCard({
    data = null
}) {
    const rows = [];

    if (data) {
        const filteredFields = [];

        Object.entries(data).forEach(([key, value]) => {
            if (reportsColumnsMap.has(key)) {

                let formatedValue = value;

                if (key === "amount") {
                    formatedValue = formatedValue.toLocaleString("es-VE", {minimumFractionDigits: 2});
                }

                if (key === "date") {
                    formatedValue = new Date(formatedValue).toLocaleString("es-VE", {day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric"});
                }

                filteredFields.push([reportsColumnsMap.get(key), formatedValue]);
            }
        })

        const segments = Math.floor(filteredFields.length / 2);

        for (let index = 0; index <= segments; index++) {
            const doubleIndex = index * 2;
            rows.push(filteredFields.slice(doubleIndex, doubleIndex + 2));
        }
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