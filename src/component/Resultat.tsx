import React, { FormEvent, useEffect, useState } from "react"
import traduction from '../../traductions/traduction.json'
import { ReponseType } from "../request/requestReponse"
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


type ResultatProps = {
    responses: Array<ReponseType>
}

export function Resultat({responses}: ResultatProps) {
    const chartData = {
        labels: responses.map(response => response.name),
        datasets: [
            {
                label: traduction.vote_nb,
                data: responses.map(response => response.nbVote),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: traduction.vote_result,
            },
        },
    };


    return (
        <div className="div_resultat">
            <div className="div_result_graph">
                <Bar data={chartData} options={options} />
            </div>
            <div className="div_column" style={{width: "350px", margin: "20px"}}>
                <label>{traduction.response_detail} : </label>
                {responses.map((response) => (
                <div key={response.id} className="div_list_2_column">
                    <label className="item_list_2_column">{response.name}</label>
                    {response.applicants.length > 0 && (
                    <div className="div_column item_list_2_column">
                        {response.applicants.map((applicant) => (
                        <label className="label_list_user" key={applicant.id}>{applicant.firstName} {applicant.lastName}</label>))}
                    </div>)}
                </div>))}
            </div>
        </div>
        
    )
}