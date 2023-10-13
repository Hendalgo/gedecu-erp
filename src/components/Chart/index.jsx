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
import { useState } from 'react';
import { useEffect } from 'react';
import { getBanks } from '../../helpers/banks';
import { useRef } from 'react';
import { getReports } from '../../helpers/reports';
import { useFormatDate } from '../../hooks/useFormatDate';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
); 
const Chart = () => {
  const [banks, setBanks] = useState([]);
  const [options, setOptions] = useState({
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
  });
  const [data, setData] = useState({
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    datasets: [
  ]
  });
  const formRef = useRef();
  useEffect(()=>{
    getBanks().then(e => setBanks(e.data));
    handleFilter();
  }, [formRef])
  
  const handleFilter = async ()=>{
    try {
      const form = new FormData(formRef.current);

    const dataI = (await getReports(`bank=${form.get('bank') || 1}&movement=income&period=${form.get('period') || 'daily'}`)).data;
    const dataE = (await getReports(`bank=${form.get('bank') || 1}&movement=expense&period=${form.get('period') || 'daily'}`)).data;
    setOptions({...options, scales:{
      y: {
        min: 0
      },
      x:{
        ticks: {color: "#6C757D"},
        grid:{
          display: false
        }
      }
    }});
      const chartdataI = [];
      const labels = []
      dataI.map( e => {
        chartdataI.push(e.amount);
        labels.push(useFormatDate(e.created_at));
      });
      const chartdataE = [];
      const labelE = []
      dataE.map( e => {
        chartdataE.push(e.amount);
        labels.push(useFormatDate(e.created_at));
      });
      setData({
        labels: labels,
        datasets: [
          {
            label: "Ingresos",
            data: chartdataI,
            fill: false,
            borderColor: "#198754",
            backgroundColor: "#198754",
            tension: 0.4  
      
          },
          {
            label: "Egreso",
            data: chartdataE,
            fill: false,
            borderColor: "#DC3545",
            backgroundColor: "#DC3545",
            tension: 0.4  
      
          }
        ]
      })
    } catch (error) {
      console.error(error);
    }
  }
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
                <form onChange={handleFilter} ref={formRef} className='d-flex'>
                  <select  name="period" className='form-select'>
                    <option defaultChecked value="daily">Día</option>
                    <option value="week">Semana</option>
                    <option value="month">Mes</option>
                    <option value="quarter">Trimestre</option>
                    <option value="semester">Semestre</option>
                    <option value="year">Año</option>
                  </select>
                  {
                    banks.length > 0
                    ?
                    <select  name="bank" className='form-select'>
                      {
                        banks.map((e)=>
                          <option value= {e.id} key={e.id}>{e.name}</option>
                        )
                      }
                    </select>
                    :null
                  }
                </form>
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