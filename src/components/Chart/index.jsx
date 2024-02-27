import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./Chart.css";
import { frecuencies } from "../../consts/frecuencies";
import { getCurrencies } from "../../helpers/currencies";
import { getMovementStatistics } from "../../helpers/statistics";
import { Alert } from "react-bootstrap";
import { handleError } from "../../utils/error";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const datasetsOptions = {
  tension: 0.3,
  borderColor: "#198754",
  backgroundColor: "#198754",
  borderWidth: 1,
}

const options = {
  elements: {
    point: {},
  },
  scales: {
    x: {
      grid: {
        display: false,
      }
    },
    y: {},
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: "#ffffff",
      borderColor: "#E6EDFF",
      borderWidth: 1,
      titleColor: "#6C757D",
      titleFont: {
        family: "Inter",
        weight: 400,
      },
      titleAlign: "center",
      bodyColor: "#000",
      bodyAlign: "center",
      usePointStyle: true,
      pointStyle: "circle",
      boxPadding: 4,
      boxWidth: 6,
      bodyFont: {
        family: "Inter",
        weight: 700,
        size: 16,
      },
      padding: 12,
    },
  }
}

const Chart = () => {
  const [currencies, setCurrencies] = useState([]);
  const [currency, setCurrency] = useState(1);
  const [frecuency, setFrecuency] = useState("day");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [alert, setAlert] = useState({ messages: [], variant: "danger" });

  const handleErrors = (err) => {
    setAlert((prev) => ({ ...prev, messages: handleError(err) }));
  }

  useEffect(() => {
    getCurrencies("paginated=no")
    .then((response) => {
      setCurrencies(response.map(({name, id, shortcode}) => {
        return { label: `${name} (${shortcode})`, value: id }
      }));

      fetchData(currency, frecuency);
    })
    .catch((err) => handleErrors(err));
  }, []);

  const handleCurrencyChange = ({ target }) => {
    const { value } = target;
    setCurrency(parseInt(value));
    let currentFrecuency = frecuency;

    if (!currentFrecuency) {
      currentFrecuency = frecuencies.at(0).value;
      setFrecuency(currentFrecuency);
    }

    fetchData(value, currentFrecuency);
  }

  const handleFrecuencyChange = ({ target }) => {
    const { value } = target;
    setFrecuency(value);
    let currentCurrency = currency;

    if (!currentCurrency) {
      currentCurrency = currencies.at(0).value;
      setCurrency(currentCurrency);
    }

    fetchData(currentCurrency, value);
  }

  const fetchData = async (currency, frecuency) => {
    setAlert((prev) => ({ ...prev, messages: [] }));

    try {
      const { income, neutro, expense } = await getMovementStatistics(`currency=${currency}&period=${frecuency}`);

      let keys = new Set();
      const datasets = [];

      if (income) {
        Object.keys(income).forEach((key) => keys.add(key));
      }

      if (neutro) {
        Object.keys(neutro).forEach((key) => keys.add(key));
      }

      if (expense) {
        Object.keys(expense).forEach((key) => keys.add(key));
      }

      datasets.push(
        {
          ...datasetsOptions,
          label: "Ingresos",
          data: [],
        },
        {
          ...datasetsOptions,
          label: "Neutro",
          borderColor: "#0d6efd",
          backgroundColor: "#0d6efd",
          data: [],
        },
        {
          ...datasetsOptions,
          label: "Egresos",
          borderColor: "#dc3545",
          backgroundColor: "#dc3545",
          data: [],
        }
      );

      const labels = Array.from(keys);

      if (frecuency == "day") {
        labels.sort((a, b) => {
          return new Date(a).getTime() - new Date(b).getTime();
        });
      }

      labels.forEach((key) => {
        let value = 0;

        if (income) {
          if (income[key]) {
            value = income[key];
          }
  
          datasets[0].data.push(value);
        }

        value = 0;
        if (neutro) {
          if (neutro[key]) {
            value = neutro[key];
          }
  
          datasets[1].data.push(value);
        }

        value = 0;
        if (expense) {
          if (expense[key]) {
            value = expense[key];
          }
          datasets.at(2).data.push(value);
        }
      });

      setChartData((prev) => ({ ...prev, labels, datasets }));
      
    } catch (err) {
      handleErrors(err);
    }
  }

  return (
    <div className="w-100 bg-white p-4 rounded border">
      <div className="row align-items-center ChartTop">
        <div className="col-6 d-flex">
          <span className="Income d-flex align-items-center">Ingreso</span>
          <span className="Neutro d-flex align-items-center">Neutro</span>
          <span className="Outcome d-flex align-items-center">Egreso</span>
        </div>
        <div className="col-6 row d-flex justify-content-end p-0">
          <select defaultValue={currency} className="col form-select form-select-sm me-2" onChange={handleCurrencyChange}>
            {
              currencies.map(({ value, label }) => {
                return <option key={value} value={value} label={label}></option>
              })
            }
          </select>
          <select defaultValue={frecuency} className="col form-select form-select-sm" onChange={handleFrecuencyChange}>
            {
              frecuencies.map(({ value, label }) => {
                return <option key={value} value={value} label={label}></option>
              })
            }
          </select>
        </div>
      </div>
      <Alert show={alert.messages.length > 0} variant={alert.variant}>
        <ul className="m-0">
          {
            alert.messages.map((message, index) => {
              return <li key={index}>{message}</li>
            })
          }
        </ul>
      </Alert>
      <Line
        data={chartData}
        options={options}
      />
    </div>
  );
};

export default Chart;