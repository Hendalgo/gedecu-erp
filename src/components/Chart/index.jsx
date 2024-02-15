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
import { useFormatDate } from "../../hooks/useFormatDate";
import Select from "react-select";
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
  tension: 0.1,
  borderColor: "green",
  backgroundColor: "yellow",
  borderWidth: 1,
}

const Chart = () => {
  const [currencies, setCurrencies] = useState([]);
  const [currency, setCurrency] = useState(null);
  const [frecuency, setFrecuency] = useState(null);
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
    })
    .catch((err) => handleErrors(err));
  }, []);

  const handleCurrencyChange = (option) => {
    setCurrency(option);
    let currentFrecuency = frecuency;

    if (!currentFrecuency) {
      currentFrecuency = frecuencies.at(0);
      setFrecuency(currentFrecuency);
    }

    fetchData(option.value, currentFrecuency.value);
  }

  const handleFrecuencyChange = (option) => {
    setFrecuency(option);
    let currentCurrency = currency;

    if (!currentCurrency) {
      currentCurrency = currencies.at(0);
      setCurrency(currentCurrency);
    }

    fetchData(currentCurrency.value, option.value);
  }

  const fetchData = async (currency, frecuency) => {
    setAlert((prev) => ({ ...prev, messages: [] }));

    try {
      const { income, neutro, expense } = await getMovementStatistics(`currency=${currency}&period=${frecuency}`);

      let keys = new Set();
      const datasets = [];

      if (income) {
        Object.keys(income).forEach((key) => keys.add(key));
        datasets.push({
          ...datasetsOptions,
          label: "Ingresos",
          data: [],
        });
      }

      if (neutro) {
        Object.keys(neutro).forEach((key) => keys.add(key));
        datasets.push({
          ...datasetsOptions,
          label: "Neutro",
          borderColor: "blue",
          data: [],
        });
      }

      if (expense) {
        Object.keys(expense).forEach((key) => keys.add(key));
        datasets.push({
          ...datasetsOptions,
          label: "Egresos",
          borderColor: "red",
          data: [],
        });
      }

      /* **
      * Arreglar el ordenamiento de las keys: las fechas pueden llegar en orden diferente porque están en distintos objetos. Ver cómo ordenarlos
      */

      const labels = Array.from(keys);

      if (frecuency == "day") {
        labels.sort((a, b) => {
          return a.split(",").pop().localeCompare(b.split(",").pop());
        });
      }

      labels.forEach((key) => {
        let value = 0;

        if (income[key]) {
          value = income[key];
        }

        datasets[0].data.push(value);

        value = 0;
        if (neutro[key]) {
          value = neutro[key];
        }

        datasets[1].data.push(value);

        value = 0;
        if (expense[key]) {
          value = expense[key];
        }

        datasets.at(2).data.push(value);
      });

      setChartData((prev) => ({ ...prev, labels, datasets }));
      
    } catch (err) {
      handleErrors(err);
    }
  }

  // const [options, setOptions] = useState({
  //   scales: {
  //     y: {
  //       min: 0,
  //       max: 10000,
  //     },
  //     x: {
  //       ticks: { color: "#6C757D" },
  //       grid: {
  //         display: false,
  //       },
  //     },
  //   },
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },
  //     tooltip: {
  //       backgroundColor: "#ffffff",
  //       borderColor: "#E6EDFF",
  //       borderWidth: 1,
  //       titleColor: "#6C757D",
  //       titleFont: {
  //         family: "Inter",
  //         weight: 400,
  //       },
  //       titleAlign: "center",
  //       bodyColor: "#000",
  //       bodyAlign: "center",
  //       usePointStyle: true,
  //       pointStyle: "circle",
  //       boxPadding: 4,
  //       boxWidth: 6,
  //       bodyFont: {
  //         family: "Inter",
  //         weight: 700,
  //         size: 16,
  //       },
  //       padding: 12,
  //     },
  //   },
  // });

  return (
    <div className="w-100 bg-white p-4 rounded border">
      <div className="mb-4 d-flex justify-content-end" style={{gap: "3%"}}>
        <Select inputId="currency" name="currency_id" options={currencies} value={currency} placeholder="Moneda" onChange={handleCurrencyChange} className="w-25" />
        <Select inputId="frecuency" name="frecuency" options={frecuencies} value={frecuency} placeholder="Periodo" onChange={handleFrecuencyChange} className="w-25" />
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
        options={null}
      />
      {/* <div className="container-fluid bg-white ChartContainer">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center ChartTop">
              <div className="d-flex">
                <span className="Income d-flex align-items-center">
                  Ingresos
                </span>
                <span className="Outcome d-flex align-items-center">
                  Egresos
                </span>
              </div>
              <div className="d-flex ChartFilterContainer">
                <form onChange={handleFilter} ref={formRef} className="d-flex">
                  <select name="period" className="form-select">
                    <option defaultChecked value="daily">
                      Día
                    </option>
                    <option value="week">Semana</option>
                    <option value="month">Mes</option>
                    <option value="quarter">Trimestre</option>
                    <option value="semester">Semestre</option>
                    <option value="year">Año</option>
                  </select>
                  {banks.length > 0 ? (
                    <select name="bank" className="form-select">
                      {banks.map((e) => (
                        <option value={e.id} key={e.id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <Line options={options} data={data} />
        </div>
      </div> */}
    </div>
  );
};

export default Chart;