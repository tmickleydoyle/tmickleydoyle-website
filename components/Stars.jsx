import React from 'react';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";

import { useState, useEffect } from 'react';

const Stars = () => {
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const [showStartChart, setShowStartChart] = useState(false);
    const options = {
        indexAxis: "y",
        plugins: {
            legend: {
                position: "top",
                labels: {
                    boxWidth: 7,
                    usePointStyle: true,
                    pointStyle: "circle",
                },
                title: {
                    text: "Stars GitHub",
                    display: true,
                    color: "#000",
                    font: {
                        size: 18,
                    },
                    padding: {
                        top: 10,
                        bottom: 10,
                    },
                    align: "center",
                },
            },
        },
        scales: {
            xAxes: [{
                ticks: {
                    display: true
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 50,
                right: 50,
            }
        }
    }

    useEffect(() => {
        async function fetchStars() {
            const res = await fetch('/api/github_stars');
            const data = await res.json();

            for (let i = 0; i < data.length; i++) {
                setValues(values => [...values, data[i].stars]);
                setLabels(labels => [...labels, data[i].name]);
            }

            setShowStartChart(true);
        }
        fetchStars();
    }, []);

    if (showStartChart === false) {
        return (
            <div className='greytext'>
                <br />
                <a>&nbsp;</a>
                Loading Data...
            </div>
        )
    }

    return (
        <>
            <Bar
                data={
                    {
                        "labels": [...labels].reverse(),
                        "datasets": [
                            {
                                "label": "Number of Stars",
                                "data": [...values].reverse(),
                                "backgroundColor": [
                                    'rgba(169,169,169)'
                                ]
                            }
                        ],
                        borderColor: [
                            'rgba(169,169,169)'
                        ],
                        borderWidth: 1
                    }
                }
                type="bar"
                height={
                    800
                }
                width={
                    600
                }
                options={options
                }
            />
        </>
    )
}

export default Stars;