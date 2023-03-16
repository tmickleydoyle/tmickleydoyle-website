import React from 'react';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";

import { useState, useEffect } from 'react';

const Contributions = () => {
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const [showChart, setShowChart] = useState(false);
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
                    text: "Contributions to Personal GitHub Repositories by Day",
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
        async function fetchData() {
            const res = await fetch('/api/github_contributions');
            const data = await res.json();

            for (let i = 0; i < data.data.user.contributionsCollection.contributionCalendar.weeks.length; i++) {
                for (let j = 0; j < data.data.user.contributionsCollection.contributionCalendar.weeks[i].contributionDays.length; j++) {
                    if (data.data.user.contributionsCollection.contributionCalendar.weeks[i].contributionDays[j].contributionCount > 0) {
                        setValues(values => [...values, data.data.user.contributionsCollection.contributionCalendar.weeks[i].contributionDays[j].contributionCount]);
                        setLabels(labels => [...labels, data.data.user.contributionsCollection.contributionCalendar.weeks[i].contributionDays[j].date]);
                    }
                }
            }
            setShowChart(true);
        }
        fetchData();
    }, []);

    if (showChart === false) {
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
                        "labels": labels,
                        "datasets": [
                            {
                                "label": "Commits",
                                "data": values,
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

export default Contributions;