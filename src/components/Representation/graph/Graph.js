import React, { useContext } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {ProcessContext} from '../../../context/Process';

ChartJS.register(ArcElement, Tooltip, Legend);


function Graph() {
    const {manager} = useContext(ProcessContext);
    let labels= manager.map(e=>[e.name])
    let dataManager= manager.map(e=>[e.size]);


    let data = {
        labels,
        datasets: [
            {
                label: "Procesos",
                data: dataManager,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                ],
            },
        ],
    };

    return (
        <div className="col">
            <Doughnut data={data}  redraw={false}/>
        </div>
    );
}

export {Graph};