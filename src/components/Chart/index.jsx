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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Chart = () => {
  const [currencies, setCurrencies] = useState([]);
  const [currency, setCurrency] = useState(null);
  const [frecuency, setFrecuency] = useState(null);
  const [alert, setAlert] = useState({ messages: [], variant: "danger" });

  const handleErrors = (err) => {
    let errorMessages = [];

    if (err.response) {
      const { message, errors } = err.response.data;
      if (errors) {
        errorMessages = Object.values(errors).flat();
      } else {
        errorMessages.push(message);
      }
    } else {
      errorMessages.push(err.message);
    }

    setAlert((prev) => ({ ...prev, messages: errorMessages }));
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
      const response = await getMovementStatistics(`currency=${currency}&period=${frecuency}`);
      console.log(response)
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

  // const handleFilter = async () => {
  //   try {
  //     const form = new FormData(formRef.current);

  //     const data = await getReports(
  //       `bank=${form.get("bank") || 1}&movement=income&period=${form.get("period") || "daily"}`,
  //     );
  //     setOptions({
  //       ...options,
  //       scales: {
  //         y: {
  //           min: 0,
  //         },
  //         x: {
  //           ticks: { color: "#6C757D" },
  //           grid: {
  //             display: false,
  //           },
  //         },
  //       },
  //     });
  //     const chartdataI = [];
  //     let labels = Object.keys(data).reverse();
  //     const chartdataE = [];
  //     if (formRef.current.period.value === "year") {
  //       labels.forEach((element) => {
  //         chartdataI.unshift(data[element].incomes);
  //       });
  //       labels.forEach((element) => {
  //         chartdataE.unshift(data[element].expenses);
  //       });

  //       labels = labels.reverse();
  //     } else {
  //       labels.forEach((element) => {
  //         chartdataI.push(data[element].incomes);
  //       });
  //       labels.forEach((element) => {
  //         chartdataE.push(data[element].expenses);
  //       });
  //     }
  //     setData({
  //       labels,
  //       datasets: [
  //         {
  //           label: "Ingresos",
  //           data: chartdataI,
  //           fill: false,
  //           borderColor: "#198754",
  //           backgroundColor: "#198754",
  //           tension: 0.4,
  //         },
  //         {
  //           label: "Egreso",
  //           data: chartdataE,
  //           fill: false,
  //           borderColor: "#DC3545",
  //           backgroundColor: "#DC3545",
  //           tension: 0.4,
  //         },
  //       ],
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
        data={{
          labels: ["Label 1", "Label 2"],
          datasets: [
            {
              label: "Ingreso",
              data: [],
            },
            {
              label: "Egreso",
              data: [],
            }
          ]
        }}
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