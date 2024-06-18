import { useState, useEffect } from 'react';
import '../../styles/overview.css'
import ReactApexChart from 'react-apexcharts'
import axios from "../../security/CrossOrigin"
import overviewData from './result.json';

export default function Overview() {
    const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const [amount, setAmount] = useState();
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: 'area',
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth',
            },
            xaxis: {
                type: 'datetime',
                categories: [],
            },
            tooltip: {
                x: {
                    format: 'dd.MM. yyyy',
                },
                y: {
                    formatter: function (val) {
                        return val.toFixed(2);
                    }
                }
            },
            yaxis: {
                labels: {
                    formatter: function (val) {
                        return val.toFixed(0);
                    }
                }
            },
            colors: ['rgb(13, 110, 253)', 'rgb(8, 112, 21)', 'rgb(25, 174, 219)', 'rgb(212, 181, 42)'],
        },
    });

    const loadPerformanceDetails = async () => {
        try {
            const response = await axios.get("/admin/overview", { headers: { Authorization: `Bearer ${userToken}` } });
            const result = response.data;
            //const result = overviewData;
            setAmount(result);

            const allDays = new Set([
                ...Object.keys(result.completedOrdersPerDay || {}),
                ...Object.keys(result.earningsPerDay || {}),
                ...Object.keys(result.registeredCustomersPerDay || {}),
                ...Object.keys(result.registeredDriversPerDay || {})
            ]);

            const dateList = Array.from(allDays).map(date => new Date(date));
            const minDate = new Date(Math.min(...dateList));
            const maxDate = new Date(Math.max(...dateList));
                                    
            const allDates = [];
            for (let date = new Date(minDate); date <= new Date(maxDate); date = new Date(date.getTime() + 86400000)) {
                const currentDate = new Date(date);
                currentDate.setUTCHours(0, 0, 0, 0);
                //console.log(currentDate)
                allDates.push(currentDate.toISOString().slice(0, 10));
            }

            allDates.forEach(date => allDays.add(date));
            //console.log(allDates)

            const transformedData = {
                completedOrdersPerDay: {},
                earningsPerDay: {},
                registeredCustomersPerDay: {},
                registeredDriversPerDay: {}
            };

            allDates.forEach(day => {
                transformedData.completedOrdersPerDay[day] = result.completedOrdersPerDay?.[day] || 0;
                transformedData.earningsPerDay[day] = result.earningsPerDay?.[day] || 0;
                transformedData.registeredCustomersPerDay[day] = result.registeredCustomersPerDay?.[day] || 0;
                transformedData.registeredDriversPerDay[day] = result.registeredDriversPerDay?.[day] || 0;
            });

            /*
            console.log({ name: 'objednávky', data: Object.values(transformedData.completedOrdersPerDay) },
            { name: 'zárobky', data: Object.values(transformedData.earningsPerDay) },
            { name: 'zákazníci', data: Object.values(transformedData.registeredCustomersPerDay) },
            { name: 'vodiči', data: Object.values(transformedData.registeredDriversPerDay) })
            */

            setChartData(prevState => ({
                ...prevState,
                series: [
                    { name: 'objednávky', data: Object.values(transformedData.completedOrdersPerDay) },
                    { name: 'zárobky', data: Object.values(transformedData.earningsPerDay) },
                    { name: 'zákazníci', data: Object.values(transformedData.registeredCustomersPerDay) },
                    { name: 'vodiči', data: Object.values(transformedData.registeredDriversPerDay) }
                ],
                options: {
                    ...prevState.options,
                    xaxis: {
                        ...prevState.options.xaxis,
                        categories: allDates
                    }
                }
            }));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadPerformanceDetails();
    }, []);

    return (
        <section className='container-lg overview'>

            <div className="row">
                <div className="col-lg-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">OBJEDNÁVKY</h5>
                            <div className="d-flex justify-content-between">
                                <i className="bi bi-person-raised-hand text-primary text-center fs-1 order-icon"></i>
                                <h1 className='mb-0 align-self-center'>{amount?.orders}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">ZÁROBKY</h5>
                            <div className="d-flex justify-content-between">
                                <i className="bi bi-currency-euro text-success ps-2 fs-1 earnings-icon"></i>
                                <h1 className='mb-0 align-self-center'>{amount?.earnings.toFixed(2)}€</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">ZÁKAZNÍCI</h5>
                            <div className="d-flex justify-content-between">
                                <i className="bi bi-person-fill text-info text-center fs-1 customers-icon"></i>
                                <h1 className='mb-0 align-self-center'>{amount?.customers}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">VODIČI</h5>
                            <div className="d-flex justify-content-between">
                                <i className="bi bi-car-front-fill text-warning text-center fs-1 drivers-icon"></i>
                                <h1 className='mb-0 align-self-center'>{amount?.drivers}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mt-4">
                <div className="card-body">
                    <h5 className="card-title">GRAF - REPORTY</h5>
                    <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="area"
                        height={550}
                    />
                </div>
            </div>
        </section>
    );
}