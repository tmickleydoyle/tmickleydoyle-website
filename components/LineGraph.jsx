import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";

import React, { useCallback, useRef } from 'react';

const LineGraph = ({ title, labels, data, forecast }) => {
    let ref = useRef(null);

    const downloadChart = useCallback(() => {
        const link = document.createElement("a");
        link.download = "chart.png";
        link.href = ref.current.toBase64Image();
        link.click();
    }, [])

    const options = {
        scales: {
            xAxes: [{
                ticks: {
                    display: true
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                }
            }]
        },
        layout: {
            padding: 50
        },
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                min: 0,
            }
        }
    }

    return (
        <>
            <br /> 
            <button type="button" className="btn btn-outline-secondary btn-sm margin-left" onClick={downloadChart}>Download Chart</button>
            <h3 className="metrics-card-center">{title}</h3>
            <Line
                ref={ref}
                data={
                    {
                        "labels": labels,
                        "datasets": [
                            {
                                "label": "Y Values",
                                "data": data,
                                "backgroundColor": [
                                    '#77DD77'
                                ],
                                "borderColor": [
                                    '#77DD77'
                                ],
                                "pointRadius": 1,
                            },
                            {
                                "data": forecast,
                                "backgroundColor": [
                                    "rgb(128,128,128)"
                                ],
                                "borderColor": [
                                    "rgba(128,128,128)"
                                ],
                                "pointRadius": 1,
                            }
                        ]
                    }
                }
                options={options}
            />
        </>
    )

}

export default LineGraph