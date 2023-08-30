import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2'
import "./Chart.css"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const options={
  scales:{
    y: {
      min: 0,
      max: 10000
    },
    x:{
      ticks: {color: "#6C757D"},
      grid:{
        display: false
      }
    }
  },
  plugins:{
    legend:{
      display: false,
    },
    tooltip:{
      backgroundColor: "#ffffff",
      borderColor: "#E6EDFF",
      borderWidth: 1,
      titleColor: "#6C757D", 
      titleFont:{
        family: "Inter",
        weight: 400
      },
      titleAlign: "center",
      bodyColor: "#000",
      bodyAlign: "center",
      usePointStyle: true,
      pointStyle: "circle",
      boxPadding: 4,
      boxWidth: 6,
      bodyFont:{
        family: "Inter",
        weight: 700,
        size: 16
      },
      padding: 12 
    }
  }
}
const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    datasets: [{
      label: "Ingresos",
      data: [5000, 3000, 8000, 5000, 4000, 2000, 5000, 3000, 8000, 5000, 4000, 2000],
      fill: false,
      borderColor: "#198754",
      backgroundColor: "#198754",
      tension: 0.4  

    },
    {
      label: "Egresos",
      data: [3000, 4000, 1000, 5000, 4000, 3000, 6000, 3000, 2000, 5000, 1000, 2000],
      fill: false,
      borderColor: "#DC3545",
      backgroundColor: "#DC3545",
      tension: 0.4

    }
  ]
  };  
const Chart = () => {
  return (
    <div className="d-flex">
      <div className='container-fluid bg-white ChartContainer'>
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center ChartTop">
              <div className='d-flex'>
                <span className='Income d-flex align-items-center'>Ingresos</span>
                <span className='Outcome d-flex align-items-center'>Egresos</span>
              </div>
              <div className='d-flex ChartFilterContainer'>
                <select name="date" className='form-select'>
                  <option value="day">Día</option>
                  <option value="week">Semana</option>
                  <option value="month">Mes</option>
                  <option value="quarter">Trimestre</option>
                  <option value="semester">Semestre</option>
                  <option value="year">Año</option>
                </select>
                <select name="date" className='form-select'>
                  <option value="day">Día</option>
                  <option value="week">Semana</option>
                  <option value="month">Mes</option>
                  <option value="quarter">Trimestre</option>
                  <option value="semester">Semestre</option>
                  <option value="year">Año</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <Line 
            options={options}
            data={data}
          />
        </div>
      </div>
    </div>
  )
}

export default Chart